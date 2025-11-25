import { IsEnum, IsISO8601, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../payment.enum';
import { ApiProperty } from '@nestjs/swagger';

export class WebhookDto {
  @ApiProperty({
    example: 'PAY-1234-5678',
    description: 'Unique payment reference',
  })
  @IsString()
  reference: string;

  @ApiProperty({
    enum: PaymentStatus,
    example: 'SUCCESS',
    description: 'Updated payment status',
  })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({
    example: 'TX-987654',
    description: 'Provider transaction ID',
  })
  @IsString()
  providerTransactionId: string;

  @ApiProperty({
    example: '2025-11-25T12:00:00.000Z',
    description: 'ISO timestamp from provider',
  })
  @IsISO8601()
  timestamp: string;

  @ApiProperty({
    example: 'wh_1234',
    required: false,
    description: 'Webhook ID for idempotency',
  })
  @IsOptional()
  @IsString()
  webhookId?: string;
}
