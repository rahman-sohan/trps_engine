import { Controller, Get } from '@nestjs/common';

@Controller('api/v1/search')
export class SearchController {
    constructor() {}

    @Get('available-properties')
    async searchProperty(): Promise<any> {
        return {
            status: 'success',
            message: 'Property data fetched and saved successfully',
        }
    }
}
