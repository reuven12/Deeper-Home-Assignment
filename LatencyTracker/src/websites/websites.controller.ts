import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { WebsiteDto } from './websites.dto';

@Controller('websites')
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  @Get()
  async getWebsites() {
    return await this.websitesService.getAllWebsites();
  }

  @Post()
  async createWebsite(@Body() website: WebsiteDto) {
    return await this.websitesService.createWebsite(website);
  }

  @Put(':id')
  async updateWebsiteById(
    @Param('id') websiteId: number,
    @Body() website: Partial<WebsiteDto>,
  ) {
    return await this.websitesService.updateWebsiteById(websiteId, website);
  }

  @Delete(':id')
  async deleteWebsiteById(@Param('id') websiteId: number) {
    return await this.websitesService.deleteWebsiteById(websiteId);
  }
}
