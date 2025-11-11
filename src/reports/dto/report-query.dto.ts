import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportFormat } from '../../database/entities/report.entity';

export class ReportQueryDto {
  @IsOptional()
  @IsString()
  fromDate?: string;

  @IsOptional()
  @IsString()
  toDate?: string;

  @IsOptional()
  @IsString()
  eventId?: string;

  @IsOptional()
  @IsEnum(ReportFormat)
  format?: ReportFormat;
}
