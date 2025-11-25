import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { Currency, PaymentMethod } from '../payment.enum';

export class CreatePaymentDto {
  @ApiProperty({ example: 1500, description: 'Payment amount' })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    enum: Currency,
    example: 'UGX',
    description: 'Currency of the payment',
  })
  @IsEnum(Currency)
  currency: Currency;

  @ApiProperty({
    enum: PaymentMethod,
    example: 'MOBILE_MONEY',
    description: 'Payment method used',
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @ApiProperty({
    example: '+256700000000',
    description: 'Customer phone number',
  })
  @IsString()
  customerPhone: string;

  @ApiProperty({
    example: 'customer@example.com',
    description: 'Customer email address',
  })
  @IsEmail()
  customerEmail: string;
}
