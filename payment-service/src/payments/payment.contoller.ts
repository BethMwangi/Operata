import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentStatusDto } from './dto/update-status.dto';
import { WebhookDto } from './dto/webhook.dto';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('payments')
@ApiBearerAuth()
@Controller('payments')
@UseGuards(AuthGuard)
@UsePipes(new ValidationPipe({ whitelist: true, transform: true }))
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({
    summary:
      'Create a new payment (INITIATED) and return details with reference & provider',
  })
  async create(@Body() dto: CreatePaymentDto) {
    return this.paymentService.createPayment(dto);
  }

  @Get(':reference')
  @ApiOperation({ summary: 'Get payment by reference' })
  async getByReference(@Param('reference') reference: string) {
    return this.paymentService.getByReference(reference);
  }

  @Post(':reference/status')
  @ApiOperation({
    summary:
      'Update payment status (simulate provider callback). Enforces state transitions.',
  })
  async updateStatus(
    @Param('reference') reference: string,
    @Body() dto: UpdatePaymentStatusDto,
  ) {
    return this.paymentService.updateStatus(reference, dto);
  }

  @Post('webhook/provider')
  @ApiOperation({
    summary:
      'Webhook endpoint for provider status updates (idempotent via webhookId)',
  })
  async handleWebhook(@Body() dto: WebhookDto) {
    return this.paymentService.handleWebhook(dto);
  }
}
