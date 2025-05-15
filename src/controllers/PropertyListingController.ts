import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { PropertyListingService } from '../search/property-listing.service';


@Controller('properties')
export class PropertyListingController {


  // @Get('search')
  // async searchProperties(
  //   @Query() filters: {
  //     location?: string;
  //     capacity?: number;
  //     bedrooms?: number;
  //     priceRange?: { min: number; max: number };
  //     amenities?: string[];
  //     sort?: string;
  //     limit?: number;
  //     skip?: number;
  //   }
  // ): Promise<IPropertyListing[]> {
  //   return await PropertyListingService.searchProperties(filters);
  // }

  // @Get(':id')
  // async getProperty(@Param('id') propertyId: string): Promise<IPropertyListing> {
  //   const property = await PropertyListingService.searchProperties({
  //     propertyId,
  //     limit: 1,
  //   });
  //   return property[0];
  // }
}

// Example usage of the search endpoint:
// GET /properties/search?location=Stockholm&capacity=4&bedrooms=2&amenities[]=hasWifi&amenities[]=hasPool
// GET /properties/search?priceRange[min]=100&priceRange[max]=500&sort=pricing.basePrice
// GET /properties/550097 
