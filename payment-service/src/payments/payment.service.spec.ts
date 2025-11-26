import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Currency, PaymentMethod, PaymentStatus } from './payment.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';

type MockRepo<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepo = (): MockRepo => ({
  create: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

describe('PaymentService', () => {
  let service: PaymentService;
  let repo: MockRepo<Payment>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: getRepositoryToken(Payment),
          useValue: createMockRepo(),
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    repo = module.get(getRepositoryToken(Payment));
  });

  it('should create payment with INITIATED status', async () => {
    const dto: CreatePaymentDto = {
      amount: 1000,
      currency: Currency.UGX,
      paymentMethod: PaymentMethod.MOBILE_MONEY,
      customerPhone: '+256700000001',
      customerEmail: 'test@example.com',
    };

    const created: Partial<Payment> = {
      id: 'uuid',
      reference: 'PAY-123',
      amount: '1000.00',
      currency: dto.currency,
      paymentMethod: dto.paymentMethod,
      customerPhone: dto.customerPhone,
      customerEmail: dto.customerEmail,
      status: PaymentStatus.INITIATED,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    repo.create!.mockReturnValue(created as Payment);
    repo.save!.mockResolvedValue(created as Payment);

    const result = await service.createPayment(dto);
    expect(result.status).toBe(PaymentStatus.INITIATED);
    expect(result.reference).toMatch(/^PAY-/);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
  });

  it('should throw NotFound when payment not found', async () => {
    repo.findOne!.mockResolvedValue(null);

    await expect(service.getByReference('FOO')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('should enforce valid transitions', async () => {
    const payment = {
      reference: 'PAY-1',
      status: PaymentStatus.INITIATED,
    } as Payment;

    repo.findOne!.mockResolvedValue(payment);

    // INITIATED -> PENDING (valid)
    await service.updateStatus('PAY-1', { status: PaymentStatus.PENDING });

    // INITIATED -> SUCCESS (invalid)
    payment.status = PaymentStatus.INITIATED;
    await expect(
      service.updateStatus('PAY-1', { status: PaymentStatus.SUCCESS }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
