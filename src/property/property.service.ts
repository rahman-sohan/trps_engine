import { Injectable } from '@nestjs/common';
import * as unzipper from 'unzipper';
import { CustomHttpService } from 'src/custom-http-service/custom-http.service';
import { HTTP_METHOD } from 'src/custom-http-service/httpcode.constant';
import { XmlService } from '../lib/xml2json-parse';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PropertyService {
  constructor(
    private readonly axiosService: CustomHttpService,
    private readonly xmlService: XmlService,
    private readonly databaseService: DatabaseService
  ) {}

  async fetchAndSaveAccommodationsData(url: string): Promise<any> {
    const jsonData:any = await this.fetchZipAndConvertToJson(url);
    const accommodation = jsonData.AccommodationList.Accommodation;

    return await this.databaseService.createAccommodation(accommodation);
  }

  async fetchAndSaveDescriptionsData(url: string): Promise<any> {
    const jsonData:any = await this.fetchZipAndConvertToJson(url);
    const description = jsonData.AccommodationList.Accommodation;

    return await this.databaseService.createDescription(description);
  }

  async fetchAndSaveAvailabilitiesData(url: string): Promise<any> {
    const jsonData:any = await this.fetchZipAndConvertToJson(url);
    const availability = jsonData.AvailabilitiesList.AccommodationList.Accommodation;


    return await this.databaseService.createAvailability(availability);
  }

  async fetchAndSaveRatesData(url: string): Promise<any> {
    const jsonData:any = await this.fetchZipAndConvertToJson(url);
    const rate = jsonData.RatesList.AccommodationList.Accommodation;

    return await this.databaseService.createRate(rate);
  }

  private async fetchZipAndConvertToJson(url: string): Promise<void> {
    try {
      const headers = {
        Accept: 'application/zip',
      };
      const responseType = 'arraybuffer';

      const { response: responseData } = await this.axiosService.sendRequest(url, HTTP_METHOD.GET, null, headers, responseType);

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