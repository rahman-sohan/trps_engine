import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_CONFIG } from 'src/lib/config/default.config';
import { Accommodation, AccommodationSchema } from './entities/accommodation.entity';
import { Description, DescriptionSchema } from './entities/description.entity';
import { Rate, RateSchema } from './entities/rates.entity';
import { Availability, AvailabilitySchema } from './entities/availabilities.entity';
import { PropertyListing, PropertyListingSchema } from './entities/property-listing';
import { Geography, GeographySchema } from './entities/geography.entity';
import { Location, LocationSchema } from './entities/location.entity';
import { ServiceSchema } from './entities/services.entity';
import { Service } from './entities/services.entity';

console.log('```````````````````DB``````````````````');
console.log(APP_CONFIG.MONGO_URI);
console.log('.......................................')
@Module({
    imports: [
        MongooseModule.forRoot(APP_CONFIG.MONGO_URI, {
            connectionName: 'property_engine',
        }),
        MongooseModule.forFeature(
            [
                {
                    name: Accommodation.name,
                    schema: AccommodationSchema,
                },
                {
                    name: Description.name,
                    schema: DescriptionSchema,
                },
                {
                    name: Availability.name,
                    schema: AvailabilitySchema,
                },
                {
                    name: Rate.name,
                    schema: RateSchema,
                },
                {
                    name: PropertyListing.name,
                    schema: PropertyListingSchema,
                },
                {
                    name: Geography.name,
                    schema: GeographySchema,
                },
                {
                    name: Location.name,
                    schema: LocationSchema,
                },
                {
                    name: Service.name,
                    schema: ServiceSchema,
                },
            ],
            'property_engine',
        ),
    ],
    providers: [DatabaseService],
    exports: [DatabaseService],
})
export class DatabaseModule {}
