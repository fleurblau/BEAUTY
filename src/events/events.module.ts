import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from '../database/entities/event.entity';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { Organizer } from '../database/entities/organizer.entity';
import { TicketType } from '../database/entities/ticket-type.entity';
import { TicketInstance } from '../database/entities/ticket-instance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, Organizer, TicketType, TicketInstance])],
  providers: [EventsService],
  controllers: [EventsController],
  exports: [EventsService],
})
export class EventsModule {}
