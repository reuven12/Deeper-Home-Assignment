import { Module } from '@nestjs/common';
import { WebsitesEntity } from '../websites/websites.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { MonitorService } from './monitor.service';
import { WebsiteModule } from 'src/websites/websites.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([WebsitesEntity]),
    WebsiteModule,
  ],
  providers: [MonitorService],
})
export class MonitorModule {}
