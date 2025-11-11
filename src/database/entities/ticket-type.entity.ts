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
import { Event } from './event.entity';
import { TicketInstance } from './ticket-instance.entity';
import { OrderLine } from './order-line.entity';

export enum TicketTypeStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity({ name: 'ticket_types' })
export class TicketType {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Event, (event) => event.ticketTypes, { eager: true })
  @JoinColumn({ name: 'event_id' })
  event!: Event;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: string;

  @Column()
  currency!: string;

  @Column({ type: 'int' })
  quota!: number;

  @Column({ type: 'int', default: 10 })
  maxPerOrder!: number;

  @Column({ type: 'timestamptz' })
  saleStart!: Date;

  @Column({ type: 'timestamptz' })
  saleEnd!: Date;

  @Column({ type: 'enum', enum: TicketTypeStatus, default: TicketTypeStatus.ACTIVE })
  status!: TicketTypeStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => TicketInstance, (instance) => instance.ticketType)
  ticketInstances!: TicketInstance[];

  @OneToMany(() => OrderLine, (line) => line.ticketType)
  orderLines!: OrderLine[];
}
