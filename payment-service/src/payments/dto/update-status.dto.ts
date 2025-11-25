import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../payment.enum';

export class UpdatePaymentStatusDto {
  @ApiProperty({ example: 'SUCCESS', description: 'Updated payment status' })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({
    example: 'TX-12345',
    description: 'Provider transaction ID (optional)',
    required: false,
  })
  @IsOptional()
  @IsString()
  providerTransactionId?: string;
}
