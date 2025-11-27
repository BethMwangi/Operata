import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

import { Payment } from './payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-status.dto';
import { WebhookDto } from './dto/webhook.dto';
import { PaymentStatus } from './payment.enum';
import { MetricsService } from 'src/metrics/metrics.service';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly metricsService: MetricsService,
  ) {}

  async createPayment(dto: CreatePaymentDto): Promise<Payment> {
    const reference = `PAY-${randomUUID()}`;

    const payment = this.paymentRepo.create({
      reference,
      amount: dto.amount.toFixed(2),
      currency: dto.currency,
      paymentMethod: dto.paymentMethod,
      customerPhone: dto.customerPhone,
      customerEmail: dto.customerEmail,
      status: PaymentStatus.INITIATED,
      providerName: 'MockProvider',
    });

    await this.paymentRepo.save(payment);
    this.metricsService.recordPaymentInitiated();
    this.logger.log(`Created payment ${reference} with status INITIATED`);

    return payment;
  }

  async getByReference(reference: string): Promise<Payment> {
    const payment = await this.paymentRepo.findOne({ where: { reference } });
    if (!payment) {
      throw new NotFoundException('Payment not found');
    }
    return payment;
  }

  private assertValidTransition(from: PaymentStatus, to: PaymentStatus): void {
    if (from === PaymentStatus.INITIATED && to === PaymentStatus.PENDING) {
      return;
    }
    if (
      from === PaymentStatus.PENDING &&
      (to === PaymentStatus.SUCCESS || to === PaymentStatus.FAILED)
    ) {
      return;
    }

    throw new BadRequestException(
      `Invalid status transition: ${from} -> ${to}`,
    );
  }
  private recordStatusMetric(status: PaymentStatus): void {
    switch (status) {
      case PaymentStatus.PENDING:
        this.metricsService.recordPaymentPending();
        break;
      case PaymentStatus.SUCCESS:
        this.metricsService.recordPaymentSuccess();
        break;
      case PaymentStatus.FAILED:
        this.metricsService.recordPaymentFailure();
        break;
      default:
        break;
    }
  }

  async updateStatus(
    reference: string,
    dto: UpdatePaymentStatusDto,
  ): Promise<Payment> {
    const payment = await this.getByReference(reference);

    this.assertValidTransition(payment.status, dto.status);

    payment.status = dto.status;
    if (dto.providerTransactionId) {
      payment.providerTransactionId = dto.providerTransactionId;
    }

    await this.paymentRepo.save(payment);
    this.recordStatusMetric(dto.status);
    this.logger.log(
      `Updated payment ${reference} status to ${dto.status} via manual status endpoint`,
    );

    return payment;
  }

  async handleWebhook(dto: WebhookDto): Promise<Payment> {
    const payment = await this.getByReference(dto.reference);

    const incomingId = dto.webhookId ?? dto.providerTransactionId;
    if (incomingId && payment.lastWebhookId === incomingId) {
      this.logger.log(
        `Ignoring duplicate webhook for payment ${dto.reference} (id=${incomingId})`,
      );
      return payment;
    }

    this.assertValidTransition(payment.status, dto.status);

    payment.status = dto.status;
    payment.providerTransactionId = dto.providerTransactionId;
    payment.lastWebhookId = incomingId;
    payment.lastWebhookAt = new Date(dto.timestamp);

    await this.paymentRepo.save(payment);
    this.recordStatusMetric(dto.status);
    this.logger.log(
      `Processed webhook for payment ${dto.reference}, new status ${dto.status}`,
    );

    return payment;
  }
}
