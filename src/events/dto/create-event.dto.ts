import {
  IsDateString,
  IsEnum,
  IsInt,
  IsString,
  Min,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EventCategory, EventStatus } from '../../database/entities/event.entity';
import { TicketTypeStatus } from '../../database/entities/ticket-type.entity';

class TicketTypeInput {
  @IsString()
  name!: string;

  @IsString()
  price!: string;

  @IsString()
  currency!: string;

  @IsInt()
  @Min(1)
  quota!: number;

  @IsInt()
  @Min(1)
  maxPerOrder!: number;

  @IsDateString()
  saleStart!: string;

  @IsDateString()
  saleEnd!: string;

  @IsOptional()
  @IsEnum(TicketTypeStatus)
  status?: TicketTypeStatus;
}

export class CreateEventDto {
  @IsString()
  organizerId!: string;

  @IsString()
  name!: string;

  @IsString()
  description!: string;

  @IsEnum(EventCategory)
  category!: EventCategory;

  @IsDateString()
  startsAt!: string;

  @IsDateString()
  endsAt!: string;

  @IsString()
  venue!: string;

  @IsInt()
  @Min(1)
  capacity!: number;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus;

  @ValidateNested({ each: true })
  @Type(() => TicketTypeInput)
  @ArrayMinSize(1)
  ticketTypes!: TicketTypeInput[];
}
