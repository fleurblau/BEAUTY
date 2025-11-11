import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event, EventStatus } from '../database/entities/event.entity';
import { Organizer } from '../database/entities/organizer.entity';
import { TicketType, TicketTypeStatus } from '../database/entities/ticket-type.entity';
import { TicketInstance, TicketInstanceStatus } from '../database/entities/ticket-instance.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventsRepository: Repository<Event>,
    @InjectRepository(Organizer)
    private readonly organizersRepository: Repository<Organizer>,
    @InjectRepository(TicketType)
    private readonly ticketTypesRepository: Repository<TicketType>,
    @InjectRepository(TicketInstance)
    private readonly ticketInstancesRepository: Repository<TicketInstance>,
  ) {}

  async create(dto: CreateEventDto) {
    const organizer = await this.organizersRepository.findOne({ where: { id: dto.organizerId } });
    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

    const event = this.eventsRepository.create({
      organizer,
      name: dto.name,
      description: dto.description,
      category: dto.category,
      startsAt: new Date(dto.startsAt),
      endsAt: new Date(dto.endsAt),
      venue: dto.venue,
      capacity: dto.capacity,
      status: dto.status ?? EventStatus.SCHEDULED,
    });
    const savedEvent = await this.eventsRepository.save(event);

    for (const ticket of dto.ticketTypes) {
      const ticketType = this.ticketTypesRepository.create({
        event: savedEvent,
        name: ticket.name,
        price: ticket.price,
        currency: ticket.currency,
        quota: ticket.quota,
        maxPerOrder: ticket.maxPerOrder,
        saleStart: new Date(ticket.saleStart),
        saleEnd: new Date(ticket.saleEnd),
        status: ticket.status ?? TicketTypeStatus.ACTIVE,
      });
      const savedTicketType = await this.ticketTypesRepository.save(ticketType);

      const instances: TicketInstance[] = [];
      for (let i = 0; i < ticket.quota; i += 1) {
        const serial = `${savedEvent.id}-${savedTicketType.id}-${i + 1}`;
        instances.push(
          this.ticketInstancesRepository.create({
            ticketType: savedTicketType,
            event: savedEvent,
            serial,
            qrCode: randomUUID(),
            status: TicketInstanceStatus.AVAILABLE,
          }),
        );
      }
      await this.ticketInstancesRepository.save(instances);
    }

    return this.eventsRepository.findOne({ where: { id: savedEvent.id }, relations: ['ticketTypes'] });
  }

  findAll() {
    return this.eventsRepository.find({ relations: ['ticketTypes'] });
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.eventsRepository.findOne({ where: { id } });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    if (dto.name !== undefined) {
      event.name = dto.name;
    }
    if (dto.description !== undefined) {
      event.description = dto.description;
    }
    if (dto.category !== undefined) {
      event.category = dto.category;
    }
    if (dto.startsAt !== undefined) {
      event.startsAt = new Date(dto.startsAt);
    }
    if (dto.endsAt !== undefined) {
      event.endsAt = new Date(dto.endsAt);
    }
    if (dto.venue !== undefined) {
      event.venue = dto.venue;
    }
    if (dto.capacity !== undefined) {
      event.capacity = dto.capacity;
    }
    if (dto.status !== undefined) {
      event.status = dto.status;
    }
    return this.eventsRepository.save(event);
  }

  async findById(id: string) {
    const event = await this.eventsRepository.findOne({ where: { id }, relations: ['ticketTypes'] });
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    return event;
  }
}
