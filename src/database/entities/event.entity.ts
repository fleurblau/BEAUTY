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
import { Organizer } from './organizer.entity';
import { TicketType } from './ticket-type.entity';
import { TicketInstance } from './ticket-instance.entity';
import { Report } from './report.entity';

export enum EventCategory {
  CONCERT = 'Concert',
  PARTY = 'Party',
  THEATRE = 'Theatre',
  TALK = 'Talk',
}

export enum EventStatus {
  SCHEDULED = 'Scheduled',
  ONGOING = 'Ongoing',
  FINISHED = 'Finished',
}

@Entity({ name: 'events' })
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Organizer, (organizer) => organizer.events, { eager: true })
  @JoinColumn({ name: 'organizer_id' })
  organizer!: Organizer;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column({ type: 'enum', enum: EventCategory })
  category!: EventCategory;

  @Column({ type: 'timestamptz' })
  startsAt!: Date;

  @Column({ type: 'timestamptz' })
  endsAt!: Date;

  @Column()
  venue!: string;

  @Column({ type: 'int' })
  capacity!: number;

  @Column({ type: 'enum', enum: EventStatus, default: EventStatus.SCHEDULED })
  status!: EventStatus;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => TicketType, (ticketType) => ticketType.event)
  ticketTypes!: TicketType[];

  @OneToMany(() => TicketInstance, (instance) => instance.event)
  ticketInstances!: TicketInstance[];

  @OneToMany(() => Report, (report) => report.event)
  reports!: Report[];
}
