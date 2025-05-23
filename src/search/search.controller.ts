import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SearchPropertyDto } from './dto/search-property.dto';

@Controller('api/v1/search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get('/auto-complete')
    async autoCompleteSearch(@Query('keyword') keyword: string) {
        if (!keyword) {
            keyword = 'dubai';
        }

        return await this.searchService.autoCompleteSearch(keyword);
    }

    @Post('/available-properties')
    async searchProperty(@Body() payload: SearchPropertyDto): Promise<any> {
        const { checkInDate, checkOutDate, guests, regionId, countryCode } = payload;
        const { adults, children } = guests;
        
        const availableProperties = await this.searchService.getAvailableProperties({
            checkInDate,
            checkOutDate,
            adults,
            children,
            regionId, 
            countryCode 
        });

        return availableProperties;
    }
}
