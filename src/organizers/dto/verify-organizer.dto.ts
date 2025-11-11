import { IsEnum } from 'class-validator';
import { OrganizerStatus } from '../../database/entities/organizer.entity';

export class VerifyOrganizerDto {
  @IsEnum(OrganizerStatus)
  status!: OrganizerStatus;
}
