import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../database/entities/order.entity';
import { OrderLine } from '../database/entities/order-line.entity';
import { TicketType, TicketTypeStatus } from '../database/entities/ticket-type.entity';
import { TicketInstance, TicketInstanceStatus } from '../database/entities/ticket-instance.entity';
import { Organizer } from '../database/entities/organizer.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { TicketsService } from '../tickets/tickets.service';
import { User } from '../database/entities/user.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderLine)
    private readonly orderLinesRepository: Repository<OrderLine>,
    @InjectRepository(TicketType)
    private readonly ticketTypesRepository: Repository<TicketType>,
    @InjectRepository(TicketInstance)
    private readonly ticketInstancesRepository: Repository<TicketInstance>,
    @InjectRepository(Organizer)
    private readonly organizersRepository: Repository<Organizer>,
    private readonly ticketsService: TicketsService,
  ) {}

  async createOrder(buyer: User, dto: CreateOrderDto) {
    const organizer = await this.organizersRepository.findOne({ where: { id: dto.organizerId } });
    if (!organizer) {
      throw new NotFoundException('Organizer not found');
    }

    const order = this.ordersRepository.create({
      buyer,
      organization: organizer,
      status: OrderStatus.PENDING,
      totalAmount: '0',
      currency: dto.currency,
    });
    const savedOrder = await this.ordersRepository.save(order);

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    let total = 0;
    for (const item of dto.items) {
      const ticketType = await this.ticketTypesRepository.findOne({
        where: { id: item.ticketTypeId },
        relations: ['event', 'event.organizer'],
      });
      if (!ticketType) {
        throw new NotFoundException(`Ticket type ${item.ticketTypeId} not found`);
      }
      if (ticketType.status !== TicketTypeStatus.ACTIVE) {
        throw new BadRequestException('Ticket type not active');
      }
      if (ticketType.event.organizer.id !== organizer.id) {
        throw new BadRequestException('Ticket type does not belong to this organizer');
      }
      const now = new Date();
      if (ticketType.saleStart > now || ticketType.saleEnd < now) {
        throw new BadRequestException('Ticket type not on sale');
      }
      if (item.quantity > ticketType.maxPerOrder) {
        throw new BadRequestException('Quantity exceeds maximum per order');
      }
      if (ticketType.currency !== dto.currency) {
        throw new BadRequestException('Currency mismatch');
      }

      const lineTotal = Number(ticketType.price) * item.quantity;
      total += lineTotal;

      const orderLine = this.orderLinesRepository.create({
        order: savedOrder,
        ticketType,
        unitPrice: ticketType.price,
        quantity: item.quantity,
        lineTotal: lineTotal.toFixed(2),
        feeTotal: '0.00',
      });
      await this.orderLinesRepository.save(orderLine);

      await this.ticketsService.reserveTickets(ticketType.id, item.quantity, savedOrder.id, expiresAt);
    }

    savedOrder.totalAmount = total.toFixed(2);
    await this.ordersRepository.save(savedOrder);

    return this.ordersRepository.findOne({ where: { id: savedOrder.id }, relations: ['lines'] });
  }

  async findById(id: string) {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['lines', 'buyer', 'organization', 'ticketInstances'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async markPaid(orderId: string) {
    const order = await this.findById(orderId);
    order.status = OrderStatus.PAID;
    order.paidAt = new Date();

    const tickets = await this.ticketInstancesRepository.find({
      where: { order: { id: order.id } },
    });
    tickets.forEach((ticket) => {
      ticket.status = TicketInstanceStatus.ISSUED;
      ticket.reservedUntil = null;
    });
    await this.ticketInstancesRepository.save(tickets);

    return this.ordersRepository.save(order);
  }

  async expirePendingOrders() {
    const now = new Date();
    const orders = await this.ordersRepository.find({
      where: { status: OrderStatus.PENDING },
      relations: ['ticketInstances'],
    });
    const expiredOrders = orders.filter((order) => {
      return order.ticketInstances?.some(
        (ticket) => ticket.reservedUntil && ticket.reservedUntil.getTime() < now.getTime(),
      );
    });

    for (const order of expiredOrders) {
      order.status = OrderStatus.EXPIRED;
      await this.ordersRepository.save(order);

      const tickets = await this.ticketInstancesRepository.find({
        where: { order: { id: order.id } },
      });
      tickets.forEach((ticket) => {
        ticket.status = TicketInstanceStatus.AVAILABLE;
        ticket.order = null;
        ticket.reservedUntil = null;
      });
      await this.ticketInstancesRepository.save(tickets);
    }

    return expiredOrders.length;
  }
}
