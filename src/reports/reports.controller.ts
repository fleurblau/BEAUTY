import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportQueryDto } from './dto/report-query.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, User } from '../database/entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  @Roles(UserRole.ORGANIZER)
  summary(@CurrentUser() user: User, @Query() query: ReportQueryDto) {
    return this.reportsService.getSalesSummary(user, query);
  }

  @Get('sales/download')
  @Roles(UserRole.ORGANIZER)
  download(@CurrentUser() user: User, @Query() query: ReportQueryDto) {
    return this.reportsService.generateReport(user, query);
  }
}
