import { Injectable } from '@nestjs/common';
import { CustomHttpService } from '../custom-http-service/custom-http.service';
import { HTTP_METHOD } from '../custom-http-service/httpcode.constant';
import { XmlService } from './xml2json-parse';

@Injectable()
export class SoapService {
    private readonly SOAP_URL = 'http://ws.avantio.com/soap/vrmsConnectionServices.php';
    private readonly CREDENTIALS = {
        Language: 'EN',
        UserName: 'apiwebtestenvironment',
        Password: '5B439jHSmx4F',
        LoginGA: 'ga3844',
    };

    constructor(
        private readonly httpService: CustomHttpService,
        private readonly xmlService: XmlService,
    ) {}

    async checkAvailability(params: any): Promise<any> {
        const soapEnvelope = this.buildSoapEnvelope(params);

        const headers = {
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: '',
        };

        const { response } = await this.httpService.sendRequest(this.SOAP_URL, HTTP_METHOD.POST, soapEnvelope, headers);

        const jsonResponse = await this.xmlService.convertXmlToJson(response.data);
        return jsonResponse;
    }

    private buildSoapEnvelope(params: {
        accommodationCode: string;
        userCode: string;
        adultsNumber: number;
        checkInDate: string;
        checkOutDate: string;
    }): string {
        return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="ws.avantio.com/crsConnectionServices/xsd" xmlns:crs="ws.avantio.com/crsConnectionServices">
   <soapenv:Header/>
   <soapenv:Body>
      <xsd:IsAvailableRQ>
         <crs:Credentials>
            <crs:Language>${this.CREDENTIALS.Language}</crs:Language>
            <crs:UserName>${this.CREDENTIALS.UserName}</crs:UserName>
            <crs:Password>${this.CREDENTIALS.Password}</crs:Password>
         </crs:Credentials>
         <crs:Criteria>
            <crs:Accommodation>
               <crs:AccommodationCode>${params.accommodationCode}</crs:AccommodationCode>
               <crs:UserCode>${params.userCode}</crs:UserCode>
               <crs:LoginGA>${this.CREDENTIALS.LoginGA}</crs:LoginGA>
            </crs:Accommodation>
            <crs:Occupants>
               <crs:AdultsNumber>${params.adultsNumber}</crs:AdultsNumber>
            </crs:Occupants>
            <crs:DateFrom>${params.checkInDate}</crs:DateFrom>
            <crs:DateTo>${params.checkOutDate}</crs:DateTo>
         </crs:Criteria>
      </xsd:IsAvailableRQ>
   </soapenv:Body>
</soapenv:Envelope>`;
    }
}
