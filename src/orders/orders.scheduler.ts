import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { OrdersService } from './orders.service';
import { TicketsService } from '../tickets/tickets.service';

@Injectable()
export class OrdersScheduler {
  private readonly logger = new Logger(OrdersScheduler.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly ticketsService: TicketsService,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleExpiredReservations() {
    const expiredOrders = await this.ordersService.expirePendingOrders();
    const releasedTickets = await this.ticketsService.releaseExpiredReservations();
    if (releasedTickets > 0 || expiredOrders > 0) {
      this.logger.log(`Released ${releasedTickets} tickets and expired ${expiredOrders} orders`);
    }
  }
}
