import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { OrganizersService } from './organizers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../database/entities/user.entity';
import { VerifyOrganizerDto } from './dto/verify-organizer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('organizers')
@ApiBearerAuth()
@Controller('organizers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrganizersController {
  constructor(private readonly organizersService: OrganizersService) {}

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.organizersService.findAll();
  }

  @Patch(':id/verify')
  @Roles(UserRole.ADMIN)
  verify(@Param('id') id: string, @Body() dto: VerifyOrganizerDto) {
    return this.organizersService.updateStatus(id, dto.status);
  }
}
