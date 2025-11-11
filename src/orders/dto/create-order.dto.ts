import { ArrayMinSize, IsArray, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class OrderItemDto {
  @IsString()
  ticketTypeId!: string;

  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @IsString()
  organizerId!: string;

  @IsArray()
  @ArrayMinSize(1)
  items!: OrderItemDto[];

  @IsString()
  currency!: string;

  @IsOptional()
  @IsString()
  paymentMethodId?: string;
}
