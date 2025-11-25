import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { Currency, PaymentMethod, PaymentStatus } from './payment.enum';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  @Index()
  reference: string;

  @Column('decimal', { precision: 12, scale: 2 })
  amount: string;

  @Column({ type: 'varchar' })
  currency: Currency;

  @Column({ type: 'varchar' })
  paymentMethod: PaymentMethod;

  @Column()
  customerPhone: string;

  @Column()
  customerEmail: string;

  @Column({
    type: 'varchar',
    default: PaymentStatus.INITIATED,
  })
  status: PaymentStatus;

  @Column({ nullable: true })
  providerName?: string;

  @Column({ nullable: true })
  providerTransactionId?: string;

  @Column({ nullable: true })
  lastWebhookId?: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastWebhookAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
