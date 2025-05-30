import { Body, Controller, Post } from '@nestjs/common';
import { PropertyService } from './property.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeedUrls } from 'src/lib/config/default.config';
import { SubmitBookingDto } from './dto/submit-booking.dto';
@Controller('api/v1/property')
export class PropertyController {
    constructor(private readonly propertyService: PropertyService) {}

    @Cron(CronExpression.EVERY_11_HOURS)
    @Post('update-avantio-feed')
    async updateAvantioFeed(): Promise<void> {
        console.log(`======================== Cron job started ========================`);
        console.log(`Fetching property data - Scheduled task running...`);
    
        const tasks: { url: string; method: () => Promise<void> }[] = [
            { url: FeedUrls.ACCOMMODATIONS, method: () => this.propertyService.fetchAndSaveAccommodationsData(FeedUrls.ACCOMMODATIONS) },
            { url: FeedUrls.DESCRIPTIONS, method: () => this.propertyService.fetchAndSaveDescriptionsData(FeedUrls.DESCRIPTIONS) },
            { url: FeedUrls.AVAILABILITIES, method: () => this.propertyService.fetchAndSaveAvailabilitiesData(FeedUrls.AVAILABILITIES) },
            { url: FeedUrls.RATES, method: () => this.propertyService.fetchAndSaveRatesData(FeedUrls.RATES) },
            { url: FeedUrls.GEOGRAPHIC_AREAS, method: () => this.propertyService.fetchAndSaveGeographicAreasData(FeedUrls.GEOGRAPHIC_AREAS) },
            { url: FeedUrls.SERVICES, method: () => this.propertyService.fetchAndSaveServicesData(FeedUrls.SERVICES) },
            { url: FeedUrls.PRICE_MODIFIERS, method: () => this.propertyService.fetchAndSavePriceModifiersData(FeedUrls.PRICE_MODIFIERS) },
        ];
    
        for (const task of tasks) {
            try {
                console.log(`Fetching data from ${task.url}`);
                await task.method();
            } catch (error) {
                console.error(`Error fetching data from ${task.url}:`, error);
            }
        }

        console.log(`======================== Cron job finished ========================`);
    }

    @Cron(CronExpression.EVERY_12_HOURS)
    @Post('sync-location-from-geography')
    async syncLocationFromGeography(): Promise<any> {
        console.log(`Creating location from geography - Scheduled task running`);
        try {
            return await this.propertyService.syncLocationFromGeography();
        } catch (error) {
            console.error('Error creating location from geography:', error);
            throw new Error('Error creating location from geography');
        }
    }

    @Cron(CronExpression.EVERY_12_HOURS)
    @Post('sync-properties-data')
    async syncPropertiesData(): Promise<any> {
        console.log(`========================Cron job started========================`);
        console.log(`Seeding listing data - Scheduled task running...`);

        return await this.propertyService.syncPropertiesData();
    }

    @Post('submit-booking')
    async submitBookingForm(@Body() bookingForm:SubmitBookingDto): Promise<any> {
        return this.propertyService.submitBookingForm(bookingForm);
    }

}
