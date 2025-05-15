import { Controller, Get, Post } from '@nestjs/common';
import { SearchService } from './search.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('api/v1/search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('available-properties')
    async searchProperty(): Promise<any> {

        const availableProperties = await this.searchService.getAvailableProperties();

        return availableProperties;
    }

    @Cron(CronExpression.EVERY_2_HOURS)
    @Post('update-search-data')
    async updateSearchData(): Promise<any> {
        console.log(`========================Cron job started========================`);
        console.log(`Seeding search data - Scheduled task running...`);

        await this.searchService.getAvailableProperties();

        return [];
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
