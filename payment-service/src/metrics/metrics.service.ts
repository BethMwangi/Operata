import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  Registry,
} from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry: Registry;

  private paymentInitiatedTotal!: Counter<string>;
  private paymentPendingTotal!: Counter<string>;
  private paymentSuccessTotal!: Counter<string>;
  private paymentFailureTotal!: Counter<string>;

  private httpDuration!: Histogram<string>;

  constructor() {
    this.registry = new Registry();
  }

  onModuleInit(): void {
    // Default Node.js / process metrics (CPU, memory, etc.)
    (collectDefaultMetrics as (opts: { register: Registry }) => void)({
      register: this.registry,
    });

    this.httpDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
      registers: [this.registry],
    });
    this.paymentInitiatedTotal = new Counter({
      name: 'payment_initiated_total',
      help: 'Total number of payments created in INITIATED state',
      registers: [this.registry],
    });

    this.paymentPendingTotal = new Counter({
      name: 'payment_pending_total',
      help: 'Total number of payments moved to PENDING state',
      registers: [this.registry],
    });

    this.paymentSuccessTotal = new Counter({
      name: 'payment_success_total',
      help: 'Total number of successful payments',
      registers: [this.registry],
    });

    this.paymentFailureTotal = new Counter({
      name: 'payment_failure_total',
      help: 'Total number of failed payments',
      registers: [this.registry],
    });
  }

  async getMetrics(): Promise<string> {
    const raw = this.registry.metrics() as unknown;

    if (typeof raw === 'string') {
      return raw;
    }

    if (raw && typeof (raw as Promise<string>).then === 'function') {
      return await (raw as Promise<string>);
    }

    return String(raw);
  }
  recordPaymentInitiated(): void {
    this.paymentInitiatedTotal.inc();
  }

  recordPaymentPending(): void {
    this.paymentPendingTotal.inc();
  }

  recordPaymentSuccess(): void {
    this.paymentSuccessTotal.inc();
  }

  recordPaymentFailure(): void {
    this.paymentFailureTotal.inc();
  }

  startTimer(labels: { method: string; route: string }) {
    return this.httpDuration.startTimer(labels);
  }

  observeStatus(
    stopTimer: (labels?: { status_code?: string }) => void,
    statusCode: number,
  ) {
    stopTimer({ status_code: String(statusCode) });
  }
}
