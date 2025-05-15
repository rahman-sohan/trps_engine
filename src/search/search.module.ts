import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { DatabaseModule } from 'src/database/database.module';
import { PropertyListingService } from './property-listing.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SearchController],
  providers: [SearchService, PropertyListingService]
})
export class SearchModule {}
