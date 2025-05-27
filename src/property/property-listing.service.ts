import { Injectable } from '@nestjs/common';
import { Properties } from '../database/entities/properties.entity';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PropertyListingService {
    constructor(private readonly databaseService: DatabaseService) {}

    async transformAndSaveProperty(data: {
        accommodation: any;
        availability: any;
        description: any;
        rates: any;
    }): Promise<Properties> {
        try {
            const { accommodation, availability, description, rates } = data;

            const images = this.transformImages(description.Pictures);
            const availabilityPeriods = this.transformAvailabilityPeriods(availability);
            const basePrice = this.getBasePrice(rates);

            const localityName = accommodation.LocalizationData.Locality.Name || '';
            const regionName = accommodation.LocalizationData.Region.Name || '';
            const countryName = accommodation.LocalizationData.Country.Name || '';

            const fullAddress = `${localityName}, ${regionName}, ${countryName}`;

            const propertyData: Partial<Properties> = {
                propertyId: accommodation.AccommodationId,
                name: accommodation.AccommodationName,
                type: description.InternationalizedItem[1].MasterKind.MasterKindName,
                description: this.getDescriptionInEnglish(description),
                fullAddress: fullAddress,
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
                    amenities: accommodation.Features.HouseCharacteristics,
                },
                pricing: {
                    currency: accommodation?.Currency,
                    basePrice: basePrice.toString(),
                    cleaningFee: this.getServicePrice(accommodation, '10').toString(),
                    securityDeposit: this.getServicePrice(accommodation, '11').toString(),
                    vatIncluded: accommodation.VAT?.Included === 'true',
                },
                availability: {
                    instantBooking: false,
                    minDaysNotice: availability?.MinDaysNotice ?? '0',
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
                booking_data: {
                    Language: description.InternationalizedItem[1].Language,
                    DetailsURL: description.InternationalizedItem[1].DetailsURL,
                    BookingURL: description.InternationalizedItem[1].BookingURL,
                    ContactURL: description.InternationalizedItem[1].ContactURL,
                },
                extras: {
                    MasterKind: {
                        MasterKindCode: description.InternationalizedItem[1].MasterKind.MasterKindCode,
                        MasterKindName: description.InternationalizedItem[1].MasterKind.MasterKindName
                    },
                    ExtrasSummary: description.InternationalizedItem[1].ExtrasSummary
                },
                features: {
                    Distribution: accommodation.Features.Distribution,
                    ExtrasAndServices: accommodation.Features.ExtrasAndServices,
                    Location: accommodation.Features.Location,
                },
                rating: accommodation?.Reviews?.Review?.Rating ?? '0', 
                reviews: accommodation.Reviews,
                accommodationCode: accommodation.AccommodationId,
                userCode: accommodation.UserCode,
                priceModifierId: accommodation.PriceModifierId,
                occupationalRuleId: accommodation.OccupationalRuleId,
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
            caption: "",
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
}


// {
//   "Reviews": {
//     "Review": {
//       "Language": "en",
//       "Rating": "5",
//       "Title": "TEST negative review.",
//       "PositiveComment": "Positive comment 1.\nPositive comment 2.",
//       "NegativeComment": "Negative comment 1.\nNegative comment 2.",
//       "RatingAspects": {
//         "RatingAspect": [
//           { "AspectType": "SERVICE", "Rating": "3" },
//           { "AspectType": "CLEANLINESS", "Rating": "3" },
//           { "AspectType": "ACCOMMODATION", "Rating": "6" },
//           { "AspectType": "LOCATION", "Rating": "6" },
//           { "AspectType": "VALUE_FOR_MONEY", "Rating": "4" }
//         ]
//       },
//       "BookingStartDate": "1900-01-01",
//       "BookingEndDate": "1900-01-02",
//       "ReviewDate": "2024-06-13"
//     }
//   }
// }
