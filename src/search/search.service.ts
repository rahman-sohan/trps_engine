import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PropertyListingService } from '../property/property-listing.service';
import { SoapService } from '../lib/soap.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';

@Injectable()
export class SearchService {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly soapService: SoapService
    ) {}

    async autoCompleteSearch(keyword: string): Promise<any> {
        const result = await this.databaseService.autoCompleteSearch(keyword);
        return result;
    }

    async getAvailableProperties(payload: any): Promise<any> {
        const { checkInDate, checkOutDate, adults, children, regionId, countryCode } = payload;
        const numberOfNights = (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24);
        const numberOfGuests = adults + children;

        const query = {
            'location.locality.code': regionId,
            // 'availability.availablePeriods.StartDate': { $lte: checkInDate },
            // 'availability.availablePeriods.EndDate': { $gte: checkOutDate },
            // 'details.capacity.minOccupation': { $lte: numberOfGuests },
            // 'details.capacity.maxOccupation': { $gte: numberOfGuests },
            // 'availability.availablePeriods.State': 'Available',
        };

        const availableProperties = await this.databaseService.getAvailableProperties(query);
        const total_properties = await this.databaseService.getTotalPropertiesCount(query);
        
        return {
            total_properties,
            properties: this.customListingResponse(availableProperties, numberOfNights),
        };
    }

    async getFeaturedProperties(regionId: string): Promise<any> {
        regionId = '190';
        const featuredProperties = await this.databaseService.getFeaturedProperties(regionId);

        return this.customListingResponse(featuredProperties, 1);
    }

    async getPropertyDetails(propertyId: string): Promise<any> {
        const property = await this.databaseService.getPropertyDetails(propertyId);

        if (!property) {
            throw new NotFoundException('Property not found');
        }

        return {
            property_id: property.propertyId,
            property_name: property.name,
            property_type: property.type,
            property_description: property.description,
            property_fullAddress: property.fullAddress,
            property_location: property.location,
            property_image: property.images,
            property_price: property.pricing,
            property_details: property.details,
            property_rules: property.rules,
            property_extra_services: property.extras,
            property_features: property.features,
            property_availability: property.availability,
            property_reviews: property.reviews ?? {},
            property_rating: property.rating,
            property_stay_discounts: property.stayDiscounts ?? [],
            property_userCode: property.userCode,
            property_accommodationCode: property.accommodationCode,
            property_occupationalRuleId: property.occupationalRuleId,
            property_priceModifierId: property.priceModifierId,
        };
    }

    async checkAvailability(payload: CheckAvailabilityDto): Promise<any> {
        const { accommodationCode, userCode, adultsNumber, checkInDate, checkOutDate } = payload;
        
        return await this.soapService.checkAvailability({
            accommodationCode,
            userCode,
            adultsNumber,
            checkInDate,
            checkOutDate,
        });
    }

    async getBookingPrice(payload: CheckAvailabilityDto): Promise<any> {
        const { accommodationCode, userCode, adultsNumber, checkInDate, checkOutDate } = payload;

        const bookingPrice = await this.soapService.getBookingPrice({
            accommodationCode,
            userCode,
            adultsNumber,
            checkInDate,
            checkOutDate,
        });

        const services = await Promise.all(bookingPrice.services.map(async (service) => ({
            code: service.code,
            name: (await this.databaseService.getServiceFromCode(service.code))?.name,
            amount: service.amount,
            price: service.price,
            appliedTaxPercentage: service.appliedTaxPercentage,
        })));

        return {
            ...bookingPrice,
            services,
        };
    }

    private customListingResponse(availableProperties: any, numberOfNights: number): any {
        return availableProperties.map((property) => {
            const propertyType: any = property.extras?.['MasterKind']?.['MasterKindName'];

            return {
                property_Id: property.propertyId,
                property_name: property.name,
                property_fullAddress: property.fullAddress,
                property_type: propertyType,
                property_image: property.images[0] ?? {
                    url: "https://fakeimg.pl/600x400",
                    caption: "",
                    isPrimary: true
                },
                property_price: {
                    basePrice: property.pricing.basePrice,
                    totalPrice: (Number(property.pricing.basePrice) * numberOfNights).toFixed(2),
                    numberOfNights: numberOfNights,
                    cleaningFee: property.pricing.cleaningFee,
                    securityDeposit: property.pricing.securityDeposit,
                    vatIncluded: property.pricing.vatIncluded,
                },
                property_details: {
                    maxOccupation: property.details.capacity.maxOccupation,
                    minOccupation: property.details.capacity.minOccupation,
                    totalBeds: property.details.capacity.bedrooms == "" ? 'N/A' : property.details.capacity.bedrooms,
                    bathrooms: property.details.capacity.bathrooms
                },
                property_rating: property.rating,
                property_location: property.location,
                property_reviews: property.reviews ?? {},
            };
        });
    }
}
