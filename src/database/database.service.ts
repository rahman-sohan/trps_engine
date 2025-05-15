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
		@InjectModel(Accommodation.name, 'property_engine') private accommodationModel: Model<Accommodation>,
		@InjectModel(Description.name, 'property_engine') private descriptionModel: Model<Description>,
		@InjectModel(Availability.name, 'property_engine') private availabilityModel: Model<Availability>,
		@InjectModel(Rate.name, 'property_engine') private rateModel: Model<Rate>
	) {}
	
	async createAccommodation(accommodation: Accommodation[]) {
		const session = await this.accommodationModel.startSession();
		try {
			session.startTransaction();

			await this.accommodationModel.deleteMany({});
			await this.accommodationModel.create(accommodation, { ordered: true, session });
			
			await session.commitTransaction();
			await session.endSession();

			return accommodation;
		} catch (error) {
			await session.abortTransaction();
			await session.endSession();
			throw new Error(error);
		}
	}

	async createDescription(description: Description[]) {
		const session = await this.descriptionModel.startSession();
		try {
			session.startTransaction();

			await this.descriptionModel.deleteMany({});
			await this.descriptionModel.create(description, { ordered: true, session });
			
			await session.commitTransaction();
			await session.endSession();

			return description;
		} catch (error) {
			await session.abortTransaction();
			await session.endSession();
			throw new Error(error);
		}
	}

	async createAvailability(availability: Availability[]) {
		const session = await this.availabilityModel.startSession();
		try {
			session.startTransaction();

			await this.availabilityModel.deleteMany({});
			await this.availabilityModel.create(availability, { ordered: true, session });
			
			await session.commitTransaction();
			await session.endSession();

			return availability;
		} catch (error) {
			await session.abortTransaction();
			await session.endSession();
			throw new Error(error);
		}
	}

	async createRate(rate: Rate[]) {
		const session = await this.rateModel.startSession();
		try {
			session.startTransaction();

			await this.rateModel.deleteMany({});
			await this.rateModel.create(rate, { ordered: true, session });
			
			await session.commitTransaction();
			await session.endSession();

			return rate;
		} catch (error) {
			await session.abortTransaction();
			await session.endSession();
			throw new Error(error);
		}
	}
}
