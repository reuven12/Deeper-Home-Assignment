import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsitesController } from './websites.controller';
import { WebsitesService } from './websites.service';
import { WebsiteEntity } from './websites.entity';
import { SocketGateway } from '../socket/socket.gateway';
@Module({
  imports: [
    TypeOrmModule.forFeature([WebsiteEntity]),
  ],
  controllers: [WebsitesController],
  providers: [WebsitesService, SocketGateway],
  exports: [WebsitesService],
})
export class WebsiteModule {}
