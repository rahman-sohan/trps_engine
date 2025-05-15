import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PropertyService {
  constructor(
  ) {}

  async fetchAndSaveData(url: string): Promise<void> {
    try {
      // const response = await this.httpService.get(url).toPromise();
      // const data = response.data;

      // // Assuming data is an array of properties
      // for (const item of data) {
      // }
    } catch (error) {
      console.error('Error fetching or saving data:', error);
    }
  }
} 