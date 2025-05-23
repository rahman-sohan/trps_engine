import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PropertyListing } from '../database/entities/property-listing';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PropertyListingService {
    constructor(private readonly databaseService: DatabaseService) {}

    async transformAndSaveProperty(data: {
        accommodation: any;
        availability: any;
        description: any;
        rates: any;
    }): Promise<PropertyListing> {
        try {
            const { accommodation, availability, description, rates } = data;

            const images = this.transformImages(description.Pictures);
            const availabilityPeriods = this.transformAvailabilityPeriods(availability);
            const basePrice = this.getBasePrice(rates);

            const propertyData: Partial<PropertyListing> = {
                propertyId: accommodation.AccommodationId,
                name: accommodation.AccommodationName,
                type: accommodation.MasterKind.MasterKindName,
                description: this.getDescriptionInEnglish(description),
                location: {
                    country: {
                        code: accommodation.LocalizationData.Country.CountryCode,
                        name: accommodation.LocalizationData.Country.Name,
                    },
                    region: {
                        code: accommodation.LocalizationData.Region.RegionCode,
                        name: accommodation.LocalizationData.Region.Name,
                    },
                    city: {
                        code: accommodation.LocalizationData.City.CityCode,
                        name: accommodation.LocalizationData.City.Name,
                    },
                    province: {
                        code: accommodation.LocalizationData.Province.ProvinceCode,
                        name: accommodation.LocalizationData.Province.Name,
                    },
                    locality: {
                        code: accommodation.LocalizationData.Locality.LocalityCode,
                        name: accommodation.LocalizationData.Locality.Name,
                    },
                    postalCode: accommodation.LocalizationData.District.PostalCode,
                    address: {
                        street: accommodation.LocalizationData.Way,
                        number: accommodation.LocalizationData.Number,
                        floor: accommodation.LocalizationData.Floor,
                        door: accommodation.LocalizationData.Door,
                    },
                    coordinates: {
                        latitude: accommodation.LocalizationData.GoogleMaps?.Latitude || '',
                        longitude: accommodation.LocalizationData.GoogleMaps?.Longitude || '',
                    },
                },
                details: {
                    capacity: {
                        total: accommodation.Features.Distribution.PeopleCapacity ?? '0',
                        bedrooms: accommodation.Features.Distribution.Bedrooms ?? '0',
                        bathrooms:
                            accommodation.Features.Distribution.BathroomWithBathtub ||
                            '0' + accommodation.Features.Distribution.BathroomWithShower ||
                            '0',
                        minOccupation: accommodation.Features.Distribution.MinimumOccupation ?? '0',
                        maxOccupation: accommodation.Features.Distribution.PeopleCapacity ?? '0',
                    },
                    area: {
                        size: accommodation.Features.Distribution.AreaHousing.Area ?? '0',
                        unit: accommodation.Features.Distribution.AreaHousing.AreaUnit,
                    },
                    amenities: {
                        hasTV: accommodation.Features.HouseCharacteristics.TV === 'true',
                        hasSatelliteTV: accommodation.Features.HouseCharacteristics.TVSatellite?.Value === 'true',
                        hasWifi: this.hasService(accommodation, '8'),
                        hasElevator: accommodation.Features.HouseCharacteristics.Elevator === 'true',
                        hasGarden: accommodation.Features.HouseCharacteristics.Garden === 'true',
                        hasParking: this.hasService(accommodation, '3'),
                        hasPool: !!accommodation.Features.HouseCharacteristics.SwimmingPool,
                        hasAirConditioning: false,
                        hasHeating: this.hasService(accommodation, '1'),
                        hasWashingMachine:
                            accommodation.Features.HouseCharacteristics.Kitchen.WashingMachine === 'true',
                        hasDishwasher: accommodation.Features.HouseCharacteristics.Kitchen.Dishwasher === 'true',
                        hasTerrace: accommodation.Features.HouseCharacteristics.Terrace === 'true',
                        allowsPets: this.hasService(accommodation, '9'),
                    },
                },
                pricing: {
                    currency: accommodation.Currency,
                    basePrice: basePrice.toString(),
                    cleaningFee: this.getServicePrice(accommodation, '10').toString(),
                    securityDeposit: this.getServicePrice(accommodation, '11').toString(),
                    vatIncluded: accommodation.VAT?.Included === 'true',
                },
                availability: {
                    instantBooking: false,
                    minDaysNotice: availability.MinDaysNotice ?? '0',
                    availablePeriods: availabilityPeriods,
                },
                images: images,
                rules: {
                    checkIn: {
                        from: accommodation.CheckInCheckOutInfo?.CheckInRules?.CheckInRule?.Schedule?.From || '',
                        to: accommodation.CheckInCheckOutInfo?.CheckInRules?.CheckInRule?.Schedule?.To || '',
                    },
                    checkOut: accommodation.CheckInCheckOutInfo?.CheckOutSchedule || '',
                    minimumStay: '1',
                    cancellationPolicy: '',
                },
                languages: this.getAvailableLanguages(description),
                status: 'active',
            };

            // Create or update the property listing
            const existingListing = await this.databaseService.findByPropertyId({
                propertyId: propertyData.propertyId as any,
            });
            if (existingListing) {
                const updatedListing = await this.databaseService.findByPropertyIdUpdateListing(
                    { propertyId: propertyData.propertyId as any },
                    propertyData,
                    { new: true, runValidators: true },
                );
                if (!updatedListing) {
                    throw new Error('Failed to update property listing');
                }
                return updatedListing;
            }

            const newListing = await this.databaseService.createPropertyListing(propertyData as any);
            return newListing;
        } catch (error) {
            console.error('Error transforming property data:', error);
            throw error;
        }
    }

    private getDescriptionInEnglish(descriptionData: any): string {
        const englishDescription = descriptionData?.InternationalizedItem?.find((item: any) => item.Language === 'en');
        return englishDescription?.Description || '';
    }

    private hasService(accommodationData: any, serviceCode: string): boolean {
        const services = accommodationData.Features?.ExtrasAndServices?.SpecialServices?.SpecialService;
        if (!services) return false;

        const serviceArray = Array.isArray(services) ? services : [services];
        const service = serviceArray.find((s: any) => s.Code === serviceCode);
        return service?.IncludedInPrice === 'true';
    }

    private getServicePrice(accommodationData: any, serviceCode: string): number {
        const services = accommodationData.Features?.ExtrasAndServices?.SpecialServices?.SpecialService;
        if (!services) return 0;

        const serviceArray = Array.isArray(services) ? services : [services];
        const service = serviceArray.find((s: any) => s.Code === serviceCode);
        return service?.AdditionalPrice?.Quantity ? parseFloat(service.AdditionalPrice.Quantity) : 0;
    }

    private transformAvailabilityPeriods(availabilityData: any): Array<any> {
        if (!availabilityData?.Availabilities?.AvailabilityPeriod) {
            return [];
        }

        const periods = Array.isArray(availabilityData.Availabilities.AvailabilityPeriod)
            ? availabilityData.Availabilities.AvailabilityPeriod
            : [availabilityData.Availabilities.AvailabilityPeriod];

        return periods.map((period: any) => ({
            startDate: new Date(period.StartDate),
            endDate: new Date(period.EndDate),
            state: period.State,
        }));
    }

    private transformImages(picturesData: any): Array<any> {
        if (!picturesData?.Picture) return [];

        const pictures = Array.isArray(picturesData.Picture) ? picturesData.Picture : [picturesData.Picture];

        return pictures.map((picture: any, index: number) => ({
            url: picture.OriginalURI,
            caption: '',
            isPrimary: index === 0,
        }));
    }

    private getBasePrice(ratesData: any): number {
        if (!ratesData?.Rates?.RatePeriod?.RoomOnly?.Price) {
            return 0;
        }
        return parseFloat(ratesData.Rates.RatePeriod.RoomOnly.Price);
    }

    private getAvailableLanguages(descriptionData: any): string[] {
        if (!descriptionData?.InternationalizedItem) {
            return [];
        }
        return descriptionData.InternationalizedItem.map((item: any) => item.Language);
    }

    // Search method remains the same
    buildPropertySearchQuery(filters: any): Record<string, any> {
        const query: any = { status: 'active' };

        if (filters.location) {
            query['$or'] = [
                {
                    'location.country.name': { $regex: filters.location, $options: 'i' },
                },
                { 'location.city.name': { $regex: filters.location, $options: 'i' } },
                { 'location.region.name': { $regex: filters.location, $options: 'i' } },
            ];
        }

        if (filters.capacity) {
            query['details.capacity.total'] = { $gte: parseInt(filters.capacity) };
        }

        if (filters.bedrooms) {
            query['details.capacity.bedrooms'] = { $gte: parseInt(filters.bedrooms) };
        }

        if (filters.priceRange) {
            query['pricing.basePrice'] = {
                $gte: filters.priceRange.min,
                $lte: filters.priceRange.max,
            };
        }

        if (filters.amenities && Array.isArray(filters.amenities)) {
            for (const amenity of filters.amenities) {
                query[`details.amenities.${amenity}`] = true;
            }
        }

        return query;
    }
}
