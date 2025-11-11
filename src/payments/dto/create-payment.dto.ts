import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';
import { PaymentStatus } from '../../database/entities/payment.entity';

export class CreatePaymentDto {
  @IsString()
  orderId!: string;

  @IsString()
  paymentMethodId!: string;

  @IsNumberString()
  amount!: string;

  @IsString()
  currency!: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}
