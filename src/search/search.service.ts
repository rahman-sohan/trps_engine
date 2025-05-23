import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PropertyListingService } from '../property/property-listing.service';

@Injectable()
export class SearchService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly propertyListingService: PropertyListingService,
    ) {}

    async autoCompleteSearch(keyword: string): Promise<any> {
        const result = await this.databaseService.autoCompleteSearch(keyword);
        return result;
    }

    async getAvailableProperties(payload: any): Promise<any> {
        // const { location, capacity, bedrooms, priceRange, amenities } = payload;

        // const query = this.propertyListingService.buildPropertySearchQuery({
        //     location,
        //     capacity,
        //     bedrooms,
        //     priceRange,
        //     amenities
        // });

        const availableProperties = await this.databaseService.getAvailableProperties({});
        return availableProperties;
    }
}
