import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_CONFIG } from 'src/lib/config/default.config';
import { Accommodation, AccommodationSchema } from './entities/accommodation.entity';
import { Description, DescriptionSchema } from './entities/description.entity';
import { Rate, RateSchema } from './entities/rates.entity';
import { Availability, AvailabilitySchema } from './entities/availabilities.entity';

@Module({
	imports: [
		MongooseModule.forRoot(APP_CONFIG.MONGO_URI, {
			connectionName: 'property_engine'
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
				}
			], 
		    'property_engine'
		),
	],
	providers: [DatabaseService],
	exports: [DatabaseService],
})

export class DatabaseModule {}
