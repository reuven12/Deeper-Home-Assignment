import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';
import { WebsitesEntity } from './websites.entity';
import { SocketGateway } from '../socket/socket.gateway';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([WebsitesEntity]),
  ],
  controllers: [WebsitesController],
  providers: [WebsitesService, SocketGateway],
})
export class WebsiteModule {}
