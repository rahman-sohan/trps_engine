import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { DatabaseModule } from 'src/database/database.module';
import { PropertyController } from './property.controller';
import { CustomHttpModule } from 'src/custom-http-service/custom-http.module';
import { XmlService } from '../lib/xml2json-parse';
import { PropertyListingService } from './property-listing.service';

@Module({
    imports: [CustomHttpModule, DatabaseModule],
    providers: [PropertyService, XmlService],
    exports: [PropertyService, XmlService, PropertyListingService],
    controllers: [PropertyController],
})
export class PropertyModule {}
