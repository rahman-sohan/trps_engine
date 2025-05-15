import { Module } from '@nestjs/common';
import { PropertyService } from './property.service';
import { DatabaseModule } from 'src/database/database.module';
import { PropertyController } from './property.controller';

@Module({
  imports: [DatabaseModule],
  providers: [PropertyService],
  exports: [PropertyService],
  controllers: [PropertyController],
})
export class PropertyModule {} 