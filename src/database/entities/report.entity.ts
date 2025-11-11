import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Organizer } from './organizer.entity';
import { Event } from './event.entity';

export enum ReportFormat {
  CSV = 'CSV',
  PDF = 'PDF',
}

@Entity({ name: 'reports' })
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Organizer, (organizer) => organizer.reports, { eager: true })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organizer;

  @ManyToOne(() => Event, (event) => event.reports, { nullable: true, eager: true })
  @JoinColumn({ name: 'event_id' })
  event?: Event | null;

  @CreateDateColumn({ type: 'timestamptz' })
  generatedAt!: Date;

  @Column({ type: 'enum', enum: ReportFormat })
  format!: ReportFormat;

  @Column()
  fileUrl!: string;

  @Column({ type: 'date', nullable: true })
  fromDate?: string | null;

  @Column({ type: 'date', nullable: true })
  toDate?: string | null;

  @UpdateDateColumn()
  updatedAt!: Date;
}
