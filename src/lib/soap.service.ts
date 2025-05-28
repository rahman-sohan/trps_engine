import { Injectable } from '@nestjs/common';
import { CustomHttpService } from '../custom-http-service/custom-http.service';
import { HTTP_METHOD } from '../custom-http-service/httpcode.constant';
import { XmlService } from './xml2json-parse';

interface BookingPriceResponse {
    bookingPrice: {
        roomOnly: number;
        roomOnlyFinal: number;
        roomOnlyWithoutOffer: number;
        roomOnlyFinalWithoutOffer: number;
        roomOnlyPaymentWhenBooking: number;
        paymentDetails: {
            paymentNumber: number;
            paymentTime: string;
            amount: number;
            paymentDate: string;
            paymentMethods: string[];
        };
        currency: string;
        appliedTaxPercentage: number;
    };

    cancellationPolicies: {
        description: string;
        policies: {
            amount: number;
            deadline: string;
        }[];
        noShow: {
            amount: number;
        };
        currency: string;
    };

    services: {
        code: string;
        amount: number;
        price: number;
        appliedTaxPercentage: number;
    }[];

    taxAmount: number;
}

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
        const soapEnvelope = this.buildSoapEnvelopeForCheckAvailability(params);

        const headers = {
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: 'IsAvailable',
        };

        const { response } = await this.httpService.sendRequest(this.SOAP_URL, HTTP_METHOD.POST, soapEnvelope, headers);
        const jsonResponse = await this.xmlService.convertXmlToJson(response.data);
        
        const availableSection = jsonResponse['soapenv:Envelope']['soapenv:Body']['ns1:IsAvailableRS']['ns2:Available'];
        const availableCode = parseInt(availableSection['ns2:AvailableCode']);
        const availableMessage = availableSection['ns2:AvailableMessage'];

        return {
            availabilityCode: availableCode === 1 ? true : false,
            availabilityMessage: availableMessage,
        };
    }

    async getBookingPrice(params: any): Promise<BookingPriceResponse> {
        const soapEnvelope = this.buildSoapEnvelopeForGetBookingPrice(params);

        const headers = {
            'Content-Type': 'text/xml;charset=UTF-8',
            SOAPAction: 'GetBookingPrice',
        };

        const { response } = await this.httpService.sendRequest(this.SOAP_URL, HTTP_METHOD.POST, soapEnvelope, headers);
        const jsonResponse = await this.xmlService.convertXmlToJson(response.data);
        
        return this.parseBookingPriceResponse(jsonResponse);
    }

    private parseBookingPriceResponse(response: any): BookingPriceResponse {        
        const bookingPriceSection = response['soapenv:Envelope']['soapenv:Body']['ns1:GetBookingPriceRS']['ns2:BookingPrice'];
        const cancellationPoliciesSection = response['soapenv:Envelope']['soapenv:Body']['ns1:GetBookingPriceRS']['ns2:CancellationPolicies'];
        const servicesSection = response['soapenv:Envelope']['soapenv:Body']['ns1:GetBookingPriceRS']['ns2:Services'];
        const taxAmount = response['soapenv:Envelope']['soapenv:Body']['ns1:GetBookingPriceRS']['ns2:TaxAmount'];

        return {
            bookingPrice: {
                roomOnly: parseFloat(bookingPriceSection['ns2:RoomOnly']),
                roomOnlyFinal: parseFloat(bookingPriceSection['ns2:RoomOnlyFinal']),
                roomOnlyWithoutOffer: parseFloat(bookingPriceSection['ns2:RoomOnlyWithoutOffer']),
                roomOnlyFinalWithoutOffer: parseFloat(bookingPriceSection['ns2:RoomOnlyFinalWithoutOffer']),
                roomOnlyPaymentWhenBooking: parseFloat(bookingPriceSection['ns2:RoomOnlyPaymentWhenBooking']),
                paymentDetails: {
                    paymentNumber: parseInt(bookingPriceSection['ns2:RoomOnlyFinalPaymentDetails']['ns2:PaymentDetail']['ns2:PaymentNumber']),
                    paymentTime: bookingPriceSection['ns2:RoomOnlyFinalPaymentDetails']['ns2:PaymentDetail']['ns2:PaymentTime'],
                    amount: parseFloat(bookingPriceSection['ns2:RoomOnlyFinalPaymentDetails']['ns2:PaymentDetail']['ns2:Amount']),
                    paymentDate: bookingPriceSection['ns2:RoomOnlyFinalPaymentDetails']['ns2:PaymentDetail']['ns2:PaymentDate'],
                    paymentMethods: Array.isArray(bookingPriceSection['ns2:RoomOnlyFinalPaymentDetails']['ns2:PaymentDetail']['ns2:PaymentMethods']['ns2:PaymentMethod'])
                        ? bookingPriceSection['ns2:RoomOnlyFinalPaymentDetails']['ns2:PaymentDetail']['ns2:PaymentMethods']['ns2:PaymentMethod']
                        : [bookingPriceSection['ns2:RoomOnlyFinalPaymentDetails']['ns2:PaymentDetail']['ns2:PaymentMethods']['ns2:PaymentMethod']],
                },
                currency: bookingPriceSection['ns2:Currency'],
                appliedTaxPercentage: parseFloat(bookingPriceSection['ns2:AppliedTaxPercentage']),
            },
            cancellationPolicies: {
                description: cancellationPoliciesSection['ns2:Description'],
                policies: Array.isArray(cancellationPoliciesSection['ns2:CancellationPolicyList']['ns2:CancellationPolicyItem'])
                    ? cancellationPoliciesSection['ns2:CancellationPolicyList']['ns2:CancellationPolicyItem'].map(policy => ({
                        amount: parseFloat(policy['ns2:RoomOnlyAmount']),
                        deadline: policy['ns2:Deadline'],
                    }))
                    : [{
                        amount: parseFloat(cancellationPoliciesSection['ns2:CancellationPolicyList']['ns2:CancellationPolicyItem']['ns2:RoomOnlyAmount']),
                        deadline: cancellationPoliciesSection['ns2:CancellationPolicyList']['ns2:CancellationPolicyItem']['ns2:Deadline'],
                    }],
                noShow: {
                    amount: parseFloat(cancellationPoliciesSection['ns2:NoShow']['ns2:RoomOnlyAmount']),
                },
                currency: cancellationPoliciesSection['ns2:Currency'],
            },
            services: Array.isArray(servicesSection['ns2:Service'])
                ? servicesSection['ns2:Service'].map(service => ({
                    code: service['ns2:Code'],
                    amount: parseInt(service['ns2:Amount']),
                    price: parseFloat(service['ns2:Price']),
                    appliedTaxPercentage: parseFloat(service['ns2:AppliedTaxPercentage']),
                }))
                : [{
                    code: servicesSection['ns2:Service']['ns2:Code'],
                    amount: parseInt(servicesSection['ns2:Service']['ns2:Amount']),
                    price: parseFloat(servicesSection['ns2:Service']['ns2:Price']),
                    appliedTaxPercentage: parseFloat(servicesSection['ns2:Service']['ns2:AppliedTaxPercentage']),
                }],
            taxAmount: parseFloat(taxAmount),
        };
    }

    private buildSoapEnvelopeForCheckAvailability(params: {
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

    private buildSoapEnvelopeForGetBookingPrice(params: {
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
      <xsd:GetBookingPriceRQ>
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
            <crs:ArrivalDate>${params.checkInDate}</crs:ArrivalDate>
            <crs:DepartureDate>${params.checkOutDate}</crs:DepartureDate>
         </crs:Criteria>
      </xsd:GetBookingPriceRQ>
   </soapenv:Body>
</soapenv:Envelope>`;
    }
}
