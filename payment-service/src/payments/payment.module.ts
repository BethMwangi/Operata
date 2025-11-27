import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Payment } from './payment.entity';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.contoller';
import { HttpModule } from '@nestjs/axios';
import { AuthClientService } from '../auth/auth.service';
import { AuthGuard } from '../auth/auth.guard';
import { MetricsModule } from 'src/metrics/metrics.module';
@Module({
  imports: [TypeOrmModule.forFeature([Payment]), HttpModule, MetricsModule],
  controllers: [PaymentController],
  providers: [PaymentService, AuthClientService, AuthGuard],
  exports: [PaymentService],
})
export class PaymentModule {}
