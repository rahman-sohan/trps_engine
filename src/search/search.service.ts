import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PropertyListingService } from './property-listing.service';

@Injectable()
export class SearchService {
    constructor(
        private readonly databaseService: DatabaseService, 
        private readonly propertyListingService: PropertyListingService) {}

    async getAvailableProperties(): Promise<any> {
        
        // const availableProperties = await this.databaseService.getAvailableProperties();

        return [];
    }

    async updateListingData(): Promise<any> {
        const getListOfAccommodations = await this.databaseService.getListOfAccommodations();
        let count = 0;
        const result = getListOfAccommodations.map(async(accommodation) => {

            const [getAccommodation, getAvailability, getDescription, getRates] = await Promise.all([
                this.databaseService.getAccommodationFromAccommodationId(accommodation.AccommodationId),
                this.databaseService.getAvailabilityFromAccommodationId(accommodation.AccommodationId),
                this.databaseService.getDescriptionFromAccommodationId(accommodation.AccommodationId),
                this.databaseService.getRatesFromAccommodationId(accommodation.AccommodationId)
            ]);
            
            const result = await this.propertyListingService.transformAndSaveProperty({
                accommodation: getAccommodation,
                availability: getAvailability,
                description: getDescription,
                rates: getRates
            });

            console.log(count++);
            
            return result;
        });

        return result;
    }
}