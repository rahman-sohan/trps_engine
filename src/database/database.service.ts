import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Accommodation } from './entities/accommodation.entity';
import { Description } from './entities/description.entity';
import { Availability } from './entities/availabilities.entity';
import { Rate } from './entities/rates.entity';
import { PropertyListing } from './entities/property-listing';

@Injectable()
export class DatabaseService {
	constructor(
		@InjectModel(Accommodation.name, 'property_engine') private accommodationModel: Model<Accommodation>,
		@InjectModel(Description.name, 'property_engine') private descriptionModel: Model<Description>,
		@InjectModel(Availability.name, 'property_engine') private availabilityModel: Model<Availability>,
		@InjectModel(Rate.name, 'property_engine') private rateModel: Model<Rate>,
		@InjectModel(PropertyListing.name, 'property_engine') private propertyListingModel: Model<PropertyListing>
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

	async getListOfAccommodations() {
		return this.accommodationModel.find({ }, { _id: 1, AccommodationId: 1 }).lean().exec();
	}

	async getAccommodationFromAccommodationId(accommodationId: string) {
		return this.accommodationModel.findOne({ AccommodationId: accommodationId }).lean().exec();
	}

	async getAvailabilityFromAccommodationId(accommodationId: string) {
		return this.availabilityModel.findOne({ AccommodationId: accommodationId }).lean().exec();
	}

	async getDescriptionFromAccommodationId(accommodationId: string) {
		return this.descriptionModel.findOne({ AccommodationId: accommodationId }).lean().exec();
	}

	async getRatesFromAccommodationId(accommodationId: string) {
		return this.rateModel.findOne({ AccommodationId: accommodationId }).lean().exec();
	}

	async createPropertyListing(propertyData: Partial<PropertyListing>): Promise<PropertyListing> {
		const [createdListing] = await this.propertyListingModel.create([propertyData]);
		return createdListing;
	}

	async findByPropertyId(query: { propertyId: string }): Promise<PropertyListing | null> {
		return this.propertyListingModel.findOne(query).lean().exec();
	}

	async findByPropertyIdUpdateListing(
		query: { propertyId: string },
		update: Partial<PropertyListing>,
		options: { new: boolean; runValidators: boolean },
	): Promise<PropertyListing | null> {
		return this.propertyListingModel.findOneAndUpdate(query, update, options).lean().exec();
	}

	async findByQuery(query: Record<string, any>): Promise<PropertyListing[]> {
		return this.propertyListingModel.find(query).lean().exec();
	}


	async getAvailableProperties(query: Record<string, any>): Promise<PropertyListing[]> {
		return this.propertyListingModel.find(query).limit(10).lean().exec();
	}
}
