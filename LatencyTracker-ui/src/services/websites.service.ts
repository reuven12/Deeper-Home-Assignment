import HttpClient from '../utils/http.client';
import config from '../config';
import { Website } from '../models/website.interfaces';
const { website, baseUrl } = config.api;

export class WebsitesService {
  static getCurds = async (): Promise<Website[]> => {
    return (await HttpClient.get(`${baseUrl}${website}`)).data as Website[];
  };

  static getCardByName = async (name: string): Promise<Website[]> => {
    return (await HttpClient.get(`${baseUrl}${website}/by-name?name=${name}`))
      .data as Website[];
  };

  static createCard = async (newWebsite: Website): Promise<void> => {
    await HttpClient.post(`${baseUrl}${website}`, newWebsite);
  };

  static updateCard = async (
    id: number,
    updatedWebsite: Partial<Website>,
  ): Promise<void> => {
    await HttpClient.put(`${baseUrl}${website}/${id}`, updatedWebsite);
  };

  static deleteCard = async (id: number): Promise<void> => {
    await HttpClient.delete(`${baseUrl}${website}/${id}`);
  };
}
