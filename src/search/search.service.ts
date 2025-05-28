import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PropertyListingService } from '../property/property-listing.service';
import { SoapService } from '../lib/soap.service';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { v4 as uuidv4 } from 'uuid';
import { SearchSession, Guests } from '../database/entities/search-session.entity';
import { SearchPropertyDto } from './dto/search-property.dto';

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
        const { checkInDate, checkOutDate, guests, regionId, countryCode, page, pageSize } = payload;
        const { adults, children } = guests;
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
        const searchSession =  await this.createSearchSession(payload, total_properties, availableProperties);
        const customProperties = await this.customListingResponse(availableProperties, numberOfNights);

        return {
            sessionId: searchSession.sessionId,
            expiresAt: searchSession.expiresAt,
            total_properties,
            properties: customProperties,
            searchParams: searchSession.searchParams,
        };
    }

    async getFeaturedProperties(regionId: string): Promise<any> {
        regionId = '190';
        const featuredProperties = await this.databaseService.getFeaturedProperties(regionId);

        return this.customListingResponse(featuredProperties, 1);
    }

    async getPropertyDetails(propertyId: string, sessionId: string): Promise<any> {
        const property = await this.databaseService.getPropertyDetails(propertyId);

        if (!property) {
            throw new NotFoundException('Property not found');
        }

        const session = await this.databaseService.getSearchSessionById(sessionId);
        let numberOfNights = 1;
        let bookingPrice = null;
        if (session) {
            try {
                bookingPrice = await this.getBookingPrice({
                    accommodationCode: property.accommodationCode,
                    userCode: property.userCode,
                    adultsNumber: session.searchParams.guests.adults,
                    checkInDate: this.formatDate(session.searchParams.checkInDate),
                    checkOutDate: this.formatDate(session.searchParams.checkOutDate),
                });
            } catch (error) {
                console.error('Error fetching booking price:', error.message);
            }

            numberOfNights = (new Date(session.searchParams.checkInDate).getTime() - new Date(session.searchParams.checkOutDate).getTime()) / (1000 * 60 * 60 * 24);
        }
        
        const convertedCurrency = await this.convertCurrency(parseFloat(property.pricing.basePrice), property.pricing.currency, 'AED');

        return {
            property_id: property.propertyId,
            property_name: property.name,
            property_type: property.type,
            property_description: property.description,
            property_fullAddress: property.fullAddress,
            property_location: property.location,
            property_image: property.images,
            property_price: {
                basePrice: convertedCurrency.amount,
                totalPrice: (Number(convertedCurrency.amount) * numberOfNights),
                currency: convertedCurrency.currency,
                numberOfNights: numberOfNights,
                cleaningFee: property.pricing.cleaningFee,
                securityDeposit: property.pricing.securityDeposit,
                vatIncluded: property.pricing.vatIncluded,
            },
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
            property_bookingPrice: bookingPrice,
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

    private async customListingResponse(availableProperties: any, numberOfNights: number): Promise<any> {
        return Promise.all(availableProperties.map(async(property) => {
            const propertyType: any = property.extras?.['MasterKind']?.['MasterKindName'];
            const convertedCurrency = await this.convertCurrency(parseFloat(property.pricing.basePrice), property.pricing.currency, 'AED');

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
                    basePrice: convertedCurrency.amount,
                    totalPrice: (Number(convertedCurrency.amount) * numberOfNights),
                    currency: convertedCurrency.currency,
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
        }));
    }

    private async convertCurrency(amount: number, fromCurrency: string, toCurrency: string): Promise<any> {
        const currencyConversion = await this.databaseService.getCurrencyConversion(fromCurrency, toCurrency);  

        if (!currencyConversion) {
            return {
                amount: amount,
                currency: fromCurrency
            };
        }

        return {
            amount: Number((amount * currencyConversion.rate).toFixed(2)),
            currency: toCurrency,
        }
    }

    private async createSearchSession(
        payload: SearchPropertyDto, 
        totalProperties: number, 
        availableProperties: any[]
    ): Promise<SearchSession> {
        const { checkInDate, checkOutDate, guests, countryCode, regionId, page, pageSize } = payload;

        const searchGuests: Guests = {
            adults: guests.adults,
            children: guests.children
        };
        
       
        const searchSessionData: Partial<SearchSession> = {
            sessionId: uuidv4(),
            searchParams: {
                checkInDate: checkInDate ? new Date(checkInDate) : new Date(),
                checkOutDate: checkOutDate ? new Date(checkOutDate) : new Date(),
                guests: searchGuests,
                countryCode: countryCode || '',
                regionId: regionId || '',
                page: page || 1,
                pageSize: pageSize || 10,
            },
            searchParamsHash: '',
            searchFinished: true,
            totalProperties: totalProperties,
            propertiesIds: availableProperties.map((property) => property.propertyId),
            createdAt: new Date(),
            expiresAt: new Date(Date.now() + 1000 * 60 * 60)
        };

        const searchSession = await this.databaseService.createSearchSession(searchSessionData);
        return searchSession;
    }

    private formatDate(isoDate: Date): string {
       return isoDate.toISOString().split('T')[0];
    }
}
