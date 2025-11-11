import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TicketType } from './ticket-type.entity';
import { Event } from './event.entity';
import { Order } from './order.entity';

export enum TicketInstanceStatus {
  AVAILABLE = 'Available',
  RESERVED = 'Reserved',
  ISSUED = 'Issued',
  USED = 'Used',
  CANCELLED = 'Cancelled',
}

@Entity({ name: 'ticket_instances' })
export class TicketInstance {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => TicketType, (ticketType) => ticketType.ticketInstances, { eager: true })
  @JoinColumn({ name: 'ticket_type_id' })
  ticketType!: TicketType;

  @ManyToOne(() => Event, (event) => event.ticketInstances)
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Column()
  serial!: string;

  @Column({ unique: true })
  qrCode!: string;

  @Column({ type: 'enum', enum: TicketInstanceStatus, default: TicketInstanceStatus.AVAILABLE })
  status!: TicketInstanceStatus;

  @Column({ type: 'timestamptz', nullable: true })
  reservedUntil?: Date | null;

  @ManyToOne(() => Order, (order) => order.ticketInstances, { nullable: true })
  @JoinColumn({ name: 'order_id' })
  order?: Order | null;

  @Column({ type: 'timestamptz', nullable: true })
  usedAt?: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
