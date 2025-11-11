import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../database/entities/order.entity';
import { OrderLine } from '../database/entities/order-line.entity';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TicketsModule } from '../tickets/tickets.module';
import { TicketType } from '../database/entities/ticket-type.entity';
import { TicketInstance } from '../database/entities/ticket-instance.entity';
import { Organizer } from '../database/entities/organizer.entity';
import { PaymentMethod } from '../database/entities/payment-method.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { OrdersScheduler } from './orders.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderLine, TicketType, TicketInstance, Organizer, PaymentMethod]),
    TicketsModule,
    ScheduleModule,
  ],
  providers: [OrdersService, OrdersScheduler],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
