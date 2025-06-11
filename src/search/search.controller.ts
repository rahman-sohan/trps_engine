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
        const { checkInDate, checkOutDate, guests, regionId, countryCode, page, pageSize } = payload;
        
        const availableProperties = await this.searchService.getAvailableProperties({
            checkInDate,
            checkOutDate,
            guests,
            regionId, 
            countryCode,
            page,
            pageSize
        });

        return availableProperties;
    }

    @Get('/featured-properties')
    async getFeaturedProperties(
        @Query('regionId') regionId?: string,
        @Query('sortBy') sortBy?: 'price_low_to_high' | 'price_high_to_low' | 'rating_low_to_high' | 'rating_high_to_low',
        @Query('page') page?: string,
        @Query('pageSize') pageSize?: string
    ): Promise<any> {
        return await this.searchService.getFeaturedProperties(
            regionId, 
            sortBy, 
            page ? parseInt(page) : 1,
            pageSize ? parseInt(pageSize) : 10
        );
    }

    @Get('/property-details/:propertyId')
    async getPropertyDetails(
        @Param('propertyId') propertyId: string,
        @Query('sessionId') sessionId:string ): Promise<any> {
            return await this.searchService.getPropertyDetails(propertyId, sessionId);
    }

    @Post('/check-availability')
    async checkAvailability(@Body() payload: CheckAvailabilityDto): Promise<any> {
        return await this.searchService.checkAvailability(payload);
    }

    @Post('get-booking-price')
    async getBookingPrice(@Body() body: CheckAvailabilityDto) {
      return this.searchService.getBookingPrice(body);
    }
}
