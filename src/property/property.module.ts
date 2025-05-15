import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { DatabaseModule } from 'src/database/database.module';
import { PropertyController } from './property.controller';
import { CustomHttpModule } from 'src/custom-http-service/custom-http.module';
import { XmlService } from '../lib/xml2json-parse';

@Module({
  imports: [ CustomHttpModule, DatabaseModule],
  providers: [PropertyService, XmlService],
  exports: [PropertyService, XmlService],
  controllers: [PropertyController],
})
export class PropertyModule {} 