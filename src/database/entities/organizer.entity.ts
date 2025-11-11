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
import { Event } from './event.entity';
import { PaymentMethod } from './payment-method.entity';
import { Order } from './order.entity';
import { Report } from './report.entity';

export enum OrganizerStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
}

@Entity({ name: 'organizers' })
export class Organizer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, (user) => user.organizers, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @Column({ nullable: true })
  photoUrl?: string;

  @Column({ type: 'enum', enum: OrganizerStatus, default: OrganizerStatus.PENDING })
  status!: OrganizerStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Event, (event) => event.organizer)
  events!: Event[];

  @OneToMany(() => PaymentMethod, (method) => method.organization)
  paymentMethods!: PaymentMethod[];

  @OneToMany(() => Order, (order) => order.organization)
  orders!: Order[];

  @OneToMany(() => Report, (report) => report.organization)
  reports!: Report[];
}
