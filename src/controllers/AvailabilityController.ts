import { Controller, Post, Body } from '@nestjs/common';
import { SoapService } from '../lib/soap.service';
import { CheckAvailabilityDto } from '../lib/dto/availability.dto';

@Controller('availability')
export class AvailabilityController {
    constructor(private readonly soapService: SoapService) {}

    @Post('check')
    async checkAvailability(@Body() checkAvailabilityDto: CheckAvailabilityDto) {
        return this.soapService.checkAvailability(checkAvailabilityDto);
    }
} 