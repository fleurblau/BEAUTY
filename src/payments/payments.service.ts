import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../database/entities/payment.entity';
import { PaymentMethod } from '../database/entities/payment-method.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { OrdersService } from '../orders/orders.service';
import { Order } from '../database/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodsRepository: Repository<PaymentMethod>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly ordersService: OrdersService,
  ) {}

  async create(dto: CreatePaymentDto) {
    const order = await this.ordersRepository.findOne({
      where: { id: dto.orderId },
      relations: ['organization'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const paymentMethod = await this.paymentMethodsRepository.findOne({
      where: { id: dto.paymentMethodId },
      relations: ['organization'],
    });
    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }
    if (paymentMethod.organization.id !== order.organization.id) {
      throw new BadRequestException('Payment method does not belong to the organizer');
    }

    const payment = this.paymentsRepository.create({
      order,
      paymentMethod,
      amount: dto.amount,
      currency: dto.currency,
      status: dto.status ?? PaymentStatus.CAPTURED,
      gatewayRef: `manual-${Date.now()}`,
      capturedAt: new Date(),
    });

    const savedPayment = await this.paymentsRepository.save(payment);

    if (savedPayment.status === PaymentStatus.CAPTURED) {
      await this.ordersService.markPaid(order.id);
    }

    return savedPayment;
  }
}
