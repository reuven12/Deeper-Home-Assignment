import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsitesEntity } from './websites.entity';
import { WebsiteDto } from './websites.dto';
import { SocketGateway } from '../socket/socket.gateway';
@Injectable()
export class WebsitesService {
  constructor(
    private readonly socketGateway: SocketGateway,
    @InjectRepository(WebsitesEntity)
    private readonly websitesRepository: Repository<WebsitesEntity>,
  ) {}

  async getAllWebsites(): Promise<WebsitesEntity[]> {
    try {
      return await this.websitesRepository.find();
    } catch (error) {
      console.error('Error in getWebsites:', error);
      throw new Error('Failed to fetch websites');
    }
  }

  async createWebsite(website: WebsiteDto): Promise<void> {
    try {
      const nextTestTime = new Date(
        Date.now() + website.testFrequency * 60 * 1000,
      );
      website.nextTestTime = nextTestTime;
      const entityToSave = this.websitesRepository.create(website);
      await this.websitesRepository.save(entityToSave);
      this.socketGateway.emitWebsiteCreated(website);
    } catch (error) {
      console.error('Error in createWebsite:', error);
      throw new Error('Failed to createWebsite');
    }
  }

  async updateWebsiteById(
    websiteId: number,
    website: Partial<WebsiteDto>,
  ): Promise<void> {
    try {
      if (website.testFrequency) {
        const nextTestTime = new Date(
          Date.now() + website.testFrequency * 60 * 1000,
        );
        website.nextTestTime = nextTestTime;
      }
      await this.websitesRepository.update(websiteId, website);
      this.socketGateway.emitWebsiteUpdated(website);
    } catch (error) {
      console.error('Error in updateWebsiteById:', error);
      throw new Error('Failed to update website');
    }
  }

  async deleteWebsiteById(websiteId: number): Promise<void> {
    try {
      await this.websitesRepository.delete(websiteId);
      this.socketGateway.emitWebsiteDeleted(websiteId);
    } catch (error) {
      console.error('Error in deleteWebsiteById:', error);
      throw new Error('Failed to delete website');
    }
  }
}
