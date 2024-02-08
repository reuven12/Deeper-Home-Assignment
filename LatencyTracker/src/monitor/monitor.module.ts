import { Module } from '@nestjs/common';
import { WebsitesService } from '../websites/websites.service';
import { WebsitesEntity } from '../websites/websites.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteModule } from '../websites/websites.module';
import { SocketGateway } from '../socket/socket.gateway';
import { ScheduleModule } from '@nestjs/schedule';
import { MonitorService } from './monitor.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([WebsitesEntity]),
    WebsiteModule,
  ],
  providers: [WebsitesService, SocketGateway, MonitorService],
})
export class MonitorModule {}