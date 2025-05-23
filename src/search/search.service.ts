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
        const { checkInDate, checkOutDate, adults, children, regionId, countryCode } = payload;
        
        const query = {
            'location.locality.code': regionId
        };

        const availableProperties = await this.databaseService.getAvailableProperties(query);

        return availableProperties;
    }
}
