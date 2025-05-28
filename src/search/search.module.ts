import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { DatabaseModule } from '../database/database.module';
import { CustomHttpModule } from '../custom-http-service/custom-http.module';
import { SoapService } from '../lib/soap.service';
import { XmlService } from '../lib/xml2json-parse';

@Module({
    imports: [DatabaseModule, CustomHttpModule],
    controllers: [SearchController],
    providers: [SearchService, SoapService, XmlService],
})
export class SearchModule {}
