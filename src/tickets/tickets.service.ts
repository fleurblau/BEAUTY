import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import {
  TicketInstance,
  TicketInstanceStatus,
} from '../database/entities/ticket-instance.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketInstance)
    private readonly ticketsRepository: Repository<TicketInstance>,
  ) {}

  async reserveTickets(ticketTypeId: string, quantity: number, orderId: string, expiresAt: Date) {
    const tickets = await this.ticketsRepository.find({
      where: {
        ticketType: { id: ticketTypeId },
        status: TicketInstanceStatus.AVAILABLE,
      },
      take: quantity,
      order: { createdAt: 'ASC' },
    });

    if (tickets.length < quantity) {
      throw new BadRequestException('Not enough tickets available');
    }

    tickets.forEach((ticket) => {
      ticket.status = TicketInstanceStatus.RESERVED;
      ticket.order = { id: orderId } as any;
      ticket.reservedUntil = expiresAt;
    });

    await this.ticketsRepository.save(tickets);
    return tickets;
  }

  async releaseExpiredReservations(now = new Date()) {
    const toRelease = await this.ticketsRepository.find({
      where: {
        status: TicketInstanceStatus.RESERVED,
        reservedUntil: LessThan(now),
      },
    });

    if (toRelease.length === 0) {
      return 0;
    }

    toRelease.forEach((ticket) => {
      ticket.status = TicketInstanceStatus.AVAILABLE;
      ticket.order = null;
      ticket.reservedUntil = null;
    });
    await this.ticketsRepository.save(toRelease);
    return toRelease.length;
  }

  async markAsUsed(qrCode: string) {
    const ticket = await this.ticketsRepository.findOne({ where: { qrCode } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.status !== TicketInstanceStatus.ISSUED) {
      throw new BadRequestException('Ticket not issued');
    }
    ticket.status = TicketInstanceStatus.USED;
    ticket.usedAt = new Date();
    return this.ticketsRepository.save(ticket);
  }

  async validateQr(qrCode: string) {
    const ticket = await this.ticketsRepository.findOne({ where: { qrCode } });
    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }
    if (ticket.status === TicketInstanceStatus.USED) {
      throw new BadRequestException('Ticket already used');
    }
    if (ticket.status !== TicketInstanceStatus.ISSUED) {
      throw new BadRequestException('Ticket not ready for validation');
    }
    ticket.status = TicketInstanceStatus.USED;
    ticket.usedAt = new Date();
    return this.ticketsRepository.save(ticket);
  }
}
