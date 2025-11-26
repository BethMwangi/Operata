import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.contoller';
import { PaymentService } from './payment.service';
import { AuthGuard } from '../auth/auth.guard';

describe('PaymentController', () => {
  let controller: PaymentController;

  const mockService = {
    createPayment: jest.fn(),
    getByReference: jest.fn(),
    updateStatus: jest.fn(),
    handleWebhook: jest.fn(),
  };

  beforeEach(async () => {
    Object.values(mockService).forEach((fn) => fn.mockReset());

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        {
          provide: PaymentService,
          useValue: mockService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<PaymentController>(PaymentController);
  });

  it('should delegate create to service', async () => {
    const dto: any = {};
    mockService.createPayment.mockResolvedValue({ id: '1' });

    const result = await controller.create(dto);

    expect(mockService.createPayment).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ id: '1' });
  });

  it('should delegate getByReference', async () => {
    mockService.getByReference.mockResolvedValue({ reference: 'PAY-1' });

    const result = await controller.getByReference('PAY-1');

    expect(mockService.getByReference).toHaveBeenCalledWith('PAY-1');
    expect(result.reference).toBe('PAY-1');
  });

  it('should delegate updateStatus to service', async () => {
    const dto: any = { status: 'SUCCESS' };

    mockService.updateStatus.mockResolvedValue({
      reference: 'PAY-1',
      status: 'SUCCESS',
    });

    const result = await controller.updateStatus('PAY-1', dto);

    expect(mockService.updateStatus).toHaveBeenCalledWith('PAY-1', dto);
    expect(result).toEqual({
      reference: 'PAY-1',
      status: 'SUCCESS',
    });
  });

  it('should delegate handleWebhook to service', async () => {
    const dto: any = {
      reference: 'PAY-1',
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
    };

    mockService.handleWebhook.mockResolvedValue({
      reference: 'PAY-1',
      status: 'SUCCESS',
    });

    const result = await controller.handleWebhook(dto);

    expect(mockService.handleWebhook).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      reference: 'PAY-1',
      status: 'SUCCESS',
    });
  });
});
