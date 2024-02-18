import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WebsitesEntity } from './websites.entity';
import { WebsiteDto } from './websites.dto';
import { SocketGateway } from '../socket/socket.gateway';
import { Subject } from 'rxjs';

@Injectable()
export class WebsitesService implements OnModuleInit {
  private websitesChangedSubject: Subject<WebsitesEntity[]> = new Subject();
  constructor(
    private readonly socketGateway: SocketGateway,
    @InjectRepository(WebsitesEntity)
    private readonly websitesRepository: Repository<WebsitesEntity>,
  ) {}

  async onModuleInit() {
    this.emitWebsitesChanged();
  }

  async getAllWebsites(): Promise<WebsitesEntity[]> {
    try {
      return await this.websitesRepository.find();
    } catch (error) {
      console.error(`Error in getWebsites: ${error}`);
      throw new Error('Failed to fetch websites');
    }
  }

  async emitWebsitesChanged() {
    console.log('Emitting websites changed');
    const websites: WebsitesEntity[] = await this.getAllWebsites();
    this.websitesChangedSubject.next(websites);
  }

  get websitesChanged() {
    return this.websitesChangedSubject.asObservable();
  }

  async createWebsite(website: WebsiteDto): Promise<void> {
    try {
      const entityToSave: WebsitesEntity = this.websitesRepository.create({
        ...website,
        nextTestTime: this.frequencyCalculation(website.testFrequency),
      });
      await this.websitesRepository.save(entityToSave);
      this.socketGateway.emitWebsiteCreated({
        ...website,
        id: entityToSave.id,
      });
      this.emitWebsitesChanged();
    } catch (error) {
      console.error('Error in creatingWebsite:', error);
      throw new Error('Failed to createWebsite');
    }
  }

  async updateWebsiteById(website: Partial<WebsiteDto>): Promise<void> {
    try {
      if (website.testFrequency)
        website.nextTestTime = this.frequencyCalculation(website.testFrequency);
      await this.websitesRepository.update(website.id, website);
      this.socketGateway.emitWebsiteUpdated(website);
      this.emitWebsitesChanged();
    } catch (error) {
      console.error('Error in updateWebsiteById:', error);
      throw new Error('Failed to update website');
    }
  }

  async deleteWebsiteById(websiteId: number): Promise<void> {
    try {
      await this.websitesRepository.delete(websiteId);
      this.socketGateway.emitWebsiteDeleted(websiteId);
      this.emitWebsitesChanged();
    } catch (error) {
      console.error('Error in deleteWebsiteById:', error);
      throw new Error('Failed to delete website');
    }
  }

  frequencyCalculation(testFrequency: number): Date {
    const futureTime = new Date(Date.now() + testFrequency * 60 * 1000);
    futureTime.setSeconds(0, 0);
    return futureTime;
  }
}
