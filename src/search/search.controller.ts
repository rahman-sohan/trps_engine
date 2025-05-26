import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchPropertyDto } from './dto/search-property.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';

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

    @Get('/featured-properties')
    async getFeaturedProperties(@Param('regionId') regionId: string): Promise<any> {
        return await this.searchService.getFeaturedProperties(regionId);
    }

    @Get('/property-details/:propertyId')
    async getPropertyDetails(@Param('propertyId') propertyId: string): Promise<any> {
        return await this.searchService.getPropertyDetails(propertyId);
    }

    @Post('/check-availability')
    async checkAvailability(@Body() payload: CheckAvailabilityDto): Promise<any> {
        return await this.searchService.checkAvailability(payload);
    }
}
