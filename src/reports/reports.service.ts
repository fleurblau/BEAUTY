import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report, ReportFormat } from '../database/entities/report.entity';
import { Order, OrderStatus } from '../database/entities/order.entity';
import { Organizer } from '../database/entities/organizer.entity';
import { Event } from '../database/entities/event.entity';
import { ReportQueryDto } from './dto/report-query.dto';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { createWriteStream } from 'fs';
import { join } from 'path';
import PDFDocument from 'pdfkit';
import { createObjectCsvWriter } from 'csv-writer';
import { User } from '../database/entities/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Organizer)
    private readonly organizersRepository: Repository<Organizer>,
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    private readonly configService: ConfigService,
  ) {}

  async getSalesSummary(organizerUser: User, query: ReportQueryDto) {
    const organizer = await this.organizersRepository.findOne({
      where: { user: { id: organizerUser.id } },
    });
    if (!organizer) {
      throw new NotFoundException('Organizer profile not found');
    }

    const qb = this.ordersRepository
      .createQueryBuilder('order')
      .innerJoin('order.organization', 'organization')
      .leftJoinAndSelect('order.lines', 'lines')
      .leftJoinAndSelect('lines.ticketType', 'ticketType')
      .leftJoinAndSelect('ticketType.event', 'event')
      .where('organization.id = :organizerId', { organizerId: organizer.id })
      .andWhere('order.status IN (:...statuses)', { statuses: [OrderStatus.PAID] });

    if (query.fromDate) {
      qb.andWhere('order.paidAt >= :fromDate', { fromDate: query.fromDate });
    }
    if (query.toDate) {
      qb.andWhere('order.paidAt <= :toDate', { toDate: query.toDate });
    }
    if (query.eventId) {
      qb.andWhere('event.id = :eventId', { eventId: query.eventId });
    }

    const orders = await qb.getMany();

    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const totalTickets = orders.reduce(
      (count, order) => count + order.lines.reduce((lineSum, line) => lineSum + line.quantity, 0),
      0,
    );

    const perEvent = new Map<string, { eventName: string; tickets: number; revenue: number }>();

    orders.forEach((order) => {
      order.lines.forEach((line) => {
        const event = line.ticketType.event;
        const key = event?.id ?? 'unknown';
        if (!perEvent.has(key)) {
          perEvent.set(key, {
            eventName: event?.name ?? 'Unassigned',
            tickets: 0,
            revenue: 0,
          });
        }
        const entry = perEvent.get(key)!;
        entry.tickets += line.quantity;
        entry.revenue += Number(line.lineTotal);
      });
    });

    return {
      organizerId: organizer.id,
      totalRevenue,
      totalTickets,
      perEvent: Array.from(perEvent.values()),
    };
  }

  async generateReport(organizerUser: User, query: ReportQueryDto) {
    const summary = await this.getSalesSummary(organizerUser, query);
    const organizer = await this.organizersRepository.findOne({
      where: { id: summary.organizerId },
      relations: ['user'],
    });
    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

    const format = query.format ?? ReportFormat.CSV;
    const basePath = this.configService.get<string>('storage.basePath', './storage');
    await fs.mkdir(basePath, { recursive: true });

    const filename = `sales-report-${organizer.id}-${Date.now()}.${format.toLowerCase()}`;
    const filePath = join(basePath, filename);

    if (format === ReportFormat.PDF) {
      await this.writePdf(filePath, organizer.user.name, summary);
    } else {
      await this.writeCsv(filePath, summary);
    }

    let event = null;
    if (query.eventId) {
      event = await this.eventsRepository.findOne({
        where: { id: query.eventId },
        relations: ['organizer'],
      });
      if (!event || event.organizer.id !== summary.organizerId) {
        event = null;
      }
    }

    const report = this.reportsRepository.create({
      organization: organizer,
      event,
      format,
      fileUrl: filePath,
      fromDate: query.fromDate,
      toDate: query.toDate,
    });

    return this.reportsRepository.save(report);
  }

  private async writePdf(filePath: string, organizerName: string, summary: any) {
    return new Promise<void>((resolve, reject) => {
      const doc = new PDFDocument();
      const stream = createWriteStream(filePath);
      doc.pipe(stream);

      doc.fontSize(18).text('Pow-er Tickets - Sales Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`Organizer: ${organizerName}`);
      doc.text(`Generated at: ${new Date().toISOString()}`);
      doc.moveDown();
      doc.text(`Total tickets sold: ${summary.totalTickets}`);
      doc.text(`Total revenue: ${summary.totalRevenue.toFixed(2)}`);
      doc.moveDown();

      summary.perEvent.forEach((event: any) => {
        doc.text(`${event.eventName} - Tickets: ${event.tickets} - Revenue: ${event.revenue.toFixed(2)}`);
      });

      doc.end();
      stream.on('finish', () => resolve());
      stream.on('error', (error) => reject(error));
    });
  }

  private async writeCsv(filePath: string, summary: any) {
    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'eventName', title: 'Event' },
        { id: 'tickets', title: 'Tickets Sold' },
        { id: 'revenue', title: 'Revenue' },
      ],
    });

    await csvWriter.writeRecords(
      summary.perEvent.map((event: any) => ({
        ...event,
        revenue: event.revenue.toFixed(2),
      })),
    );
  }
}
