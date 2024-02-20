import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { WebsiteEntity } from './websites.entity';
import { WebsiteDto } from './websites.dto';
import { SocketGateway } from '../socket/socket.gateway';
import { Subject } from 'rxjs';

@Injectable()
export class WebsitesService implements OnModuleInit {
  private websitesChangedSubject: Subject<WebsiteEntity[]> = new Subject();
  constructor(
    private readonly socketGateway: SocketGateway,
    @InjectRepository(WebsiteEntity)
    private readonly websitesRepository: Repository<WebsiteEntity>,
  ) {}

  async onModuleInit() {
    this.emitWebsitesChanged();
  }

  async emitWebsitesChanged() {
    console.log('Emitting websites changed');
    const websites: WebsiteEntity[] = await this.getAllWebsites();
    this.websitesChangedSubject.next(websites);
  }

  get websitesChanged() {
    return this.websitesChangedSubject.asObservable();
  }

  async getAllWebsites(): Promise<WebsiteEntity[]> {
    try {
      return await this.websitesRepository.find();
    } catch (error) {
      console.error(`Error in getWebsites: ${error}`);
      throw new Error('Failed to fetch websites');
    }
  }

  async getWebsiteByName(name: string): Promise<WebsiteEntity[]> {
    try {
      return await this.websitesRepository.find({
        where: { name: Like(`${name}%`) },
      });
    } catch (error) {
      console.error(`Error in getWebsiteById: ${error}`);
      throw new Error('Failed to fetch website');
    }
  }

  async createWebsite(website: WebsiteDto): Promise<void> {
    try {
      const entityToSave: WebsiteEntity = this.websitesRepository.create({
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
