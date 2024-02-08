import { Website } from '../models/website.interfaces';
import { WebsitesService } from '../services/websites.service';

export const handleCardCreated = async (newWebsite: Website) => {
  await WebsitesService.createCard(newWebsite);
};

export const handleCardDeleted = async (id: number) => {
  await WebsitesService.deleteCard(id);
};

export const handleCardUpdated = async (updatedWebsite: Partial<Website>) => {
  updatedWebsite.testFrequency = updatedWebsite.testFrequency || 5;
  await WebsitesService.updateCard(updatedWebsite.id!, updatedWebsite);
};

