import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { PaymentMethod } from './payment-method.entity';

export enum PaymentStatus {
  INITIATED = 'Initiated',
  AUTHORIZED = 'Authorized',
  CAPTURED = 'Captured',
  FAILED = 'Failed',
  REFUNDED = 'Refunded',
}

@Entity({ name: 'payments' })
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, (order) => order.payments)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => PaymentMethod, (method) => method.payments, { eager: true })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod!: PaymentMethod;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount!: string;

  @Column()
  currency!: string;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.INITIATED })
  status!: PaymentStatus;

  @Column({ nullable: true })
  gatewayRef?: string;

  @Column({ nullable: true })
  failureReason?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  capturedAt?: Date | null;

  @UpdateDateColumn()
  updatedAt!: Date;
}
