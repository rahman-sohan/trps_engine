import { Controller, Get, Inject, Post } from '@nestjs/common';

@Controller('')
export class AppController {
    constructor(
        @Inject('STARTUP_TIME') private readonly startupTime: Date,
    ) {}
    
    @Get('/')
    helthCheck(): any {
        return {
            status: 'OK',
            message: `Server is running successfully since ${this.startupTime.toISOString()}`
        };
    }

    @Post('/post')
    checkPostRequest(): any {
        return {
            status: 'POST Request',
            message: `Server is running successfully ${new Date()}`,
        };
    }
}

// https://feeds.avantio.com/accommodations/6d1885d0b17f961c8047092f6b4121a2
// https://feeds.avantio.com/descriptions/6d1885d0b17f961c8047092f6b4121a2
// https://feeds.avantio.com/availabilities/6d1885d0b17f961c8047092f6b4121a2
// https://feeds.avantio.com/rates/6d1885d0b17f961c8047092f6b4121a2
// https://feeds.avantio.com/kinds/6d1885d0b17f961c8047092f6b4121a2
// https://feeds.avantio.com/geographicareas/6d1885d0b17f961c8047092f6b4121a2
// https://feeds.avantio.com/occupationalrules/6d1885d0b17f961c8047092f6b4121a2
// https://feeds.avantio.com/pricemodifiers/6d1885d0b17f961c8047092f6b4121a2
// https://feeds.avantio.com/services/6d1885d0b17f961c8047092f6b4121a2
