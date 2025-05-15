import { Controller, Get } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeedUrls } from 'src/lib/config/default.config';

@Controller('api/v1/property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

//   @Cron(CronExpression.EVERY_12_HOURS)
  @Get('fetch-data')
  async fetchData(): Promise<any> {
    console.log('Fetching property data - Scheduled task running...');
    try {

        const data = await Promise.all([
            this.propertyService.fetchAndSaveAccommodationsData(FeedUrls.ACCOMMODATIONS),
            // this.propertyService.fetchAndSaveDescriptionsData(FeedUrls.DESCRIPTIONS),
            // this.propertyService.fetchAndSaveAvailabilitiesData(FeedUrls.AVAILABILITIES),
            // this.propertyService.fetchAndSaveRatesData(FeedUrls.RATES)
        ])

        return {
            status: 'success',
            message: 'Property data fetched and saved successfully',
            data: data
        }
    } catch (error) {
        console.error('Error fetching property data:', error);
        throw new Error('Error fetching property data');
    }
  }
} 