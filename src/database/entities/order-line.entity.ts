import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Order } from './order.entity';
import { TicketType } from './ticket-type.entity';

@Entity({ name: 'order_lines' })
export class OrderLine {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Order, (order) => order.lines)
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  @ManyToOne(() => TicketType, (ticketType) => ticketType.orderLines, { eager: true })
  @JoinColumn({ name: 'ticket_type_id' })
  ticketType!: TicketType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  unitPrice!: string;

  @Column({ type: 'int' })
  quantity!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  lineTotal!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: '0.00' })
  feeTotal!: string;
}
