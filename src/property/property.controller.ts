import { Controller } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async fetchData(): Promise<void> {
    console.log('Fetching property data - Scheduled task running...');
    const urls = [
      'https://feeds.avantio.com/accommodations/6d1885d0b17f961c8047092f6b4121a2',
      'https://feeds.avantio.com/descriptions/6d1885d0b17f961c8047092f6b4121a2',
      'https://feeds.avantio.com/availabilities/6d1885d0b17f961c8047092f6b4121a2',
    ];
    for (const url of urls) {
      const result = await this.propertyService.fetchAndSaveData(url);
      console.log(result);
    
      return result;
    }
  }
} 