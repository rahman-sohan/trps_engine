import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('api/v1/search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Post('available-properties')
    async searchProperty(@Body() payload: any): Promise<any> {
        
        const availableProperties = await this.searchService.getAvailableProperties(payload);

        return availableProperties;
    }

    @Cron(CronExpression.EVERY_2_HOURS)
    @Post('update-listing-data')
    async updateListingData(): Promise<any> {
        console.log(`========================Cron job started========================`);
        console.log(`Seeding listing data - Scheduled task running...`);

        await this.searchService.updateListingData();

        return [];
    }
}
