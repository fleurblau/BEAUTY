import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { Report } from '../database/entities/report.entity';
import { Order } from '../database/entities/order.entity';
import { Organizer } from '../database/entities/organizer.entity';
import { Event } from '../database/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Order, Organizer, Event])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
