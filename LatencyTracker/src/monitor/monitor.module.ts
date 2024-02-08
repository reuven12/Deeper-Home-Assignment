import { Module } from '@nestjs/common';
import { WebsitesService } from '../websites/websites.service';
import { WebsitesEntity } from '../websites/websites.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteModule } from '../websites/websites.module';

@Module({
  imports: [TypeOrmModule.forFeature([WebsitesEntity]), WebsiteModule],
  providers: [WebsitesService],
})
export class MonitorModule {}
