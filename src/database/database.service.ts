import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Accommodation } from './entities/accommodation.entity';
import { Description } from './entities/description.entity';
import { Availability } from './entities/availabilities.entity';
import { Rate } from './entities/rates.entity';

@Injectable()
export class DatabaseService {
	constructor(
		@InjectModel(Accommodation.name) private accommodationModel: Model<Accommodation>,
		@InjectModel(Description.name) private descriptionModel: Model<Description>,
		@InjectModel(Availability.name) private availabilityModel: Model<Availability>,
		@InjectModel(Rate.name) private rateModel: Model<Rate>
	) {}

	
	async createAccommodation(accommodation: any) {
		const accommodationData = await this.accommodationModel.insertMany(accommodation);

		return accommodationData;
	}

	async createDescription(description: Description) {
		await this.descriptionModel.deleteMany({});
		return this.descriptionModel.create(description);
	}

	async createAvailability(availability: Availability) {
		await this.availabilityModel.deleteMany({});
		return this.availabilityModel.create(availability);
	}

	async createRate(rate: Rate) {
		await this.rateModel.deleteMany({});
		return this.rateModel.create(rate);
	}	
}
