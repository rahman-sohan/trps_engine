import { Controller, Post } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeedUrls } from 'src/lib/config/default.config';

@Controller('api/v1/property')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) {}

    @Cron(CronExpression.EVERY_2_HOURS)
    @Post('fetch-updated-data')
    async fetchUpdatedData(): Promise<any> {
        console.log(`========================Cron job started========================`);
        console.log(`Fetching property data - Scheduled task running...`);
        try {
            await Promise.all([
                this.propertyService.fetchAndSaveAccommodationsData(FeedUrls.ACCOMMODATIONS),
                this.propertyService.fetchAndSaveDescriptionsData(FeedUrls.DESCRIPTIONS),
                this.propertyService.fetchAndSaveAvailabilitiesData(FeedUrls.AVAILABILITIES),
                this.propertyService.fetchAndSaveRatesData(FeedUrls.RATES),
                this.propertyService.fetchAndSaveGeographicAreasData(FeedUrls.GEOGRAPHIC_AREAS),
                // this.propertyService.fetchAndSaveImagesData(FeedUrls.IMAGES),
                // this.propertyService.fetchAndSaveFacilitiesData(FeedUrls.FACILITIES),
                // this.propertyService.fetchAndSaveAmenitiesData(FeedUrls.AMENITIES),
                // this.propertyService.fetchAndSavePoliciesData(FeedUrls.POLICIES)
            ]);

            console.log(`========================Cron job completed========================`);
            return {
                status: 'success',
                message: 'Property data fetched and saved successfully',
            };
        } catch (error) {
            console.error('Error fetching property data:', error);
            throw new Error('Error fetching property data');
        }
    }

    @Cron(CronExpression.EVERY_2_HOURS)
    @Post('create-address-from-geography')
    async createAddressFromGeography(): Promise<any> {
        console.log(`========================Cron job started========================`);
        console.log(`Creating address from geography - Scheduled task running...`);
        try {
            return this.propertyService.createAddressFromGeography();
        } catch (error) {
            console.error('Error creating address from geography:', error);
            throw new Error('Error creating address from geography');
        }
    }

    @Cron(CronExpression.EVERY_2_HOURS)
    @Post('update-listing-data')
    async updateListingData(): Promise<any> {
        console.log(`========================Cron job started========================`);
        console.log(`Seeding listing data - Scheduled task running...`);

        await this.propertyService.updateListingData();

        return [];
    }
}
