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
import { Payment } from './payment.entity';

export enum PaymentProvider {
  CARD = 'Card',
  YAPE = 'Yape',
  PLIN = 'Plin',
  TRANSFER = 'Transfer',
  CASH = 'Cash',
}

@Entity({ name: 'payment_methods' })
export class PaymentMethod {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => Organizer, (organizer) => organizer.paymentMethods, { eager: true })
  @JoinColumn({ name: 'organization_id' })
  organization!: Organizer;

  @Column({ type: 'enum', enum: PaymentProvider })
  provider!: PaymentProvider;

  @Column()
  label!: string;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ default: true })
  active!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Payment, (payment) => payment.paymentMethod)
  payments!: Payment[];
}
