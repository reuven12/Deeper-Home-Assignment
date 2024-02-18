import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';
import { WebsitesEntity } from './websites.entity';
import { SocketGateway } from '../socket/socket.gateway';
@Module({
  imports: [
    TypeOrmModule.forFeature([WebsitesEntity]),
  ],
  controllers: [WebsitesController],
  providers: [WebsitesService, SocketGateway],
  exports: [WebsitesService],
})
export class WebsiteModule {}
