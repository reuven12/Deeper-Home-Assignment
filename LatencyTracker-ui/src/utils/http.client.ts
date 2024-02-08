import axios from 'axios';

export default class HttpClient {
  static async get(url: string) {
    try {
      return await axios.get(url);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async put(url: string, body: any) {
    try {
      return await axios.put(url, body);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async post(url: string, body: any) {
    try {
      return await axios.post(url, body);
    } catch (error: any) {
      throw new Error(error);
    }
  }

  static async delete(url: string) {
    try {
      return await axios.delete(url);
    } catch (error: any) {
      throw new Error(error);
    }
  }
}
