import { Injectable } from '@nestjs/common';
import * as unzipper from 'unzipper';
import { CustomHttpService } from 'src/custom-http-service/custom-http.service';
import { HTTP_METHOD } from 'src/custom-http-service/httpcode.constant';
import { XmlService } from '../lib/xml2json-parse';
import { DatabaseService } from 'src/database/database.service';
import { PropertyListingService } from './property-listing.service';

@Injectable()
export class PropertyService {
    constructor(
        private readonly axiosService: CustomHttpService,
        private readonly xmlService: XmlService,
        private readonly databaseService: DatabaseService,
        private readonly propertyListingService: PropertyListingService,
    ) {}

    async fetchAndSaveAccommodationsData(url: string): Promise<any> {
        const jsonData: any = await this.fetchZipAndConvertToJson(url);
        const accommodation = jsonData.AccommodationList.Accommodation;

        return await this.databaseService.createAccommodation(accommodation);
    }

    async fetchAndSaveDescriptionsData(url: string): Promise<any> {
        const jsonData: any = await this.fetchZipAndConvertToJson(url);
        const description = jsonData.AccommodationList.Accommodation;

        return await this.databaseService.createDescription(description);
    }

    async fetchAndSaveAvailabilitiesData(url: string): Promise<any> {
        const jsonData: any = await this.fetchZipAndConvertToJson(url);
        const availability = jsonData.AvailabilitiesList.AccommodationList.Accommodation;

        return await this.databaseService.createAvailability(availability);
    }

    async fetchAndSaveRatesData(url: string): Promise<any> {
        const jsonData: any = await this.fetchZipAndConvertToJson(url);
        const rate = jsonData.RatesList.AccommodationList.Accommodation;

        return await this.databaseService.createRate(rate);
    }

    async fetchAndSaveGeographicAreasData(url: string): Promise<any> {
        const jsonData: any = await this.fetchZipAndConvertToJson(url);
        const geographicAreas = jsonData.GeographicAreas.InternationalizedItem.filter(
            (area: any) => area.Language === 'en',
        );
        const countries = geographicAreas[0].Countries.Country;

        const geography = countries.map((country: any) => {
            return {
                CountryCode: country.CountryCode,
                Name: country.Name,
                Regions: country.Regions,
            };
        });

        return await this.databaseService.createGeography(geography);
    }

    async fetchAndSaveServicesData(url: string): Promise<any> {
        const jsonData: any = await this.fetchZipAndConvertToJson(url);
        const services = jsonData.Services.Service;
        const servicesInEnglish = this.parseServicesInEnglish(services);

        return await this.databaseService.createServices(servicesInEnglish);
    }

    async syncLocationFromGeography(): Promise<any> {
        const geography = await this.databaseService.getGeography();

        const result: any = await Promise.all(
            geography.map(async (country: any) => {
                return await this.extractLocationsFromCountryData(country);
            }),
        );

        await this.databaseService.createLocation(result.flat());

        return {
            status: 'success',
            message: 'Location created successfully',
        };
    }

    async updateListingData(): Promise<any> {
        const getListOfAccommodations = await this.databaseService.getListOfAccommodations();
        let count = 0;
        const result = getListOfAccommodations.map(async (accommodation) => {
            const [getAccommodation, getAvailability, getDescription, getRates] = await Promise.all([
                this.databaseService.getAccommodationFromAccommodationId(accommodation.AccommodationId),
                this.databaseService.getAvailabilityFromAccommodationId(accommodation.AccommodationId),
                this.databaseService.getDescriptionFromAccommodationId(accommodation.AccommodationId),
                this.databaseService.getRatesFromAccommodationId(accommodation.AccommodationId),
            ]);

            const result = await this.propertyListingService.transformAndSaveProperty({
                accommodation: getAccommodation,
                availability: getAvailability,
                description: getDescription,
                rates: getRates,
            });

            console.log(count++);

            return result;
        });

        return result;
    }

    private parseServicesInEnglish(services: any[]): { code: string, name: string }[] {
        return services.map((service) => {
            const code = service.Code ?? '';
            const name = service.Name?.[1]?.Text ?? '';
            
            return {
                code,
                name
            }
        });
    }

    private extractLocationsFromCountryData(countryData: any): any {
        const countryName = countryData.Name;
        const countryCode = countryData.CountryCode;
        const regions = countryData.Regions?.Region ?? [];

        const normalizeArray = (value: any) => (Array.isArray(value) ? value : [value]);

        const locations: any = [];

        for (const region of normalizeArray(regions)) {
            const regionName = region.Name;
            const cities = normalizeArray(region.Cities?.City);

            for (const city of cities) {
                const cityName = city.Name;
                const localities = normalizeArray(city.Localities?.Locality);

                for (const locality of localities) {
                    const localityName = locality.Name;
                    const localityCode = locality.LocalityCode || null;

                    const districts = normalizeArray(locality.Districts?.District);

                    for (const district of districts) {
                        const districtName = district?.Name || '';
                        const postalCode = district?.PostalCode || '';
                        const districtCode = district?.DistrictCode || null;

                        const fullAddress = `${localityName}, ${districtName}, ${regionName}, ${cityName}, ${countryName}`;

                        locations.push({
                            Country: countryName,
                            CountryCode: countryCode,
                            Region: regionName,
                            City: cityName,
                            Locality: localityName,
                            LocalityCode: Number(localityCode),
                            District: districtName,
                            DistrictCode: Number(districtCode),
                            PostalCode: postalCode,
                            FullAddress: fullAddress,
                        });
                    }
                }
            }
        }

        return locations;
    }

    private async fetchZipAndConvertToJson(url: string): Promise<void> {
        try {
            const headers = {
                Accept: 'application/zip',
            };
            const responseType = 'arraybuffer';

            const { response: responseData } = await this.axiosService.sendRequest(
                url,
                HTTP_METHOD.GET,
                null,
                headers,
                responseType,
            );

            const directory = await unzipper.Open.buffer(responseData.data);
            const file = directory.files[0];
            const content = await file.buffer();

            const xml = content.toString();
            const json = await this.xmlService.convertXmlToJson(xml);
            return json;
        } catch (error) {
            console.error('Error fetching or saving data:', error);
        }
    }
}
