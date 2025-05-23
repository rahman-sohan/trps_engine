import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Controller('api/v1/search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('/auto-complete-search')
    async autoCompleteSearch(@Query('keyword') keyword: string) {
        return await this.searchService.autoCompleteSearch(keyword);
    }

    @Post('available-properties')
    async searchProperty(@Body() payload: any): Promise<any> {
        const availableProperties = await this.searchService.getAvailableProperties(payload);

        return availableProperties;
    }
}
