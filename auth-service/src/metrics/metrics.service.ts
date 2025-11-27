import { Injectable, OnModuleInit } from '@nestjs/common';
import { collectDefaultMetrics, Counter, Registry } from 'prom-client';

@Injectable()
export class MetricsService implements OnModuleInit {
  private readonly registry: Registry;

  private registerTotal!: Counter<string>;
  private loginSuccessTotal!: Counter<string>;
  private loginFailureTotal!: Counter<string>;

  constructor() {
    this.registry = new Registry();
  }

  onModuleInit(): void {
    (collectDefaultMetrics as (opts: { register: Registry }) => void)({
      register: this.registry,
    });

    this.registerTotal = new Counter({
      name: 'auth_register_total',
      help: 'Total number of successful registrations',
      registers: [this.registry],
    });

    this.loginSuccessTotal = new Counter({
      name: 'auth_login_success_total',
      help: 'Total number of successful logins',
      registers: [this.registry],
    });

    this.loginFailureTotal = new Counter({
      name: 'auth_login_failure_total',
      help: 'Total number of failed logins (invalid credentials)',
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

  recordRegister(): void {
    this.registerTotal.inc();
  }

  recordLoginSuccess(): void {
    this.loginSuccessTotal.inc();
  }

  recordLoginFailure(): void {
    this.loginFailureTotal.inc();
  }
}
