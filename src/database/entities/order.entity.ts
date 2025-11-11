import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Organizer } from './organizer.entity';
import { OrderLine } from './order-line.entity';
import { TicketInstance } from './ticket-instance.entity';
import { Payment } from './payment.entity';

export enum OrderStatus {
  PENDING = 'Pending',
  PAID = 'Paid',
  EXPIRED = 'Expired',
  CANCELLED = 'Cancelled',
  REFUNDED = 'Refunded',
}

@Entity({ name: 'orders' })
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.orders, { eager: true })
  @JoinColumn({ name: 'buyer_user_id' })
  buyer!: User;

  @ManyToOne(() => Organizer, (organizer) => organizer.orders, { eager: true })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organizer;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status!: OrderStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalAmount!: string;

  @Column()
  currency!: string;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  placedAt!: Date;

  @Column({ type: 'timestamptz', nullable: true })
  paidAt?: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => OrderLine, (line) => line.order, { cascade: true })
  lines!: OrderLine[];

  @OneToMany(() => TicketInstance, (instance) => instance.order)
  ticketInstances!: TicketInstance[];

  @OneToMany(() => Payment, (payment) => payment.order)
  payments!: Payment[];
}
