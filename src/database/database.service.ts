import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Accommodation } from './entities/accommodation.entity';
import { Description } from './entities/description.entity';
import { Availability } from './entities/availabilities.entity';
import { Rate } from './entities/rates.entity';
import { Properties } from './entities/properties.entity';
import { Geography } from './entities/geography.entity';
import { Location } from './entities/location.entity';
import { Service } from './entities/services.entity';
@Injectable()
export class DatabaseService {
    constructor(
        @InjectModel(Accommodation.name, 'property_engine')private accommodationModel: Model<Accommodation>,
        @InjectModel(Description.name, 'property_engine') private descriptionModel: Model<Description>,
        @InjectModel(Availability.name, 'property_engine') private availabilityModel: Model<Availability>,
        @InjectModel(Properties.name, 'property_engine') private propertyModel: Model<Properties>,
        @InjectModel(Geography.name, 'property_engine') private geographyModel: Model<Geography>,
        @InjectModel(Location.name, 'property_engine') private locationModel: Model<Location>,
        @InjectModel(Rate.name, 'property_engine') private rateModel: Model<Rate>,
        @InjectModel(Service.name, 'property_engine') private serviceModel: Model<Service>,
    ) {}

    async autoCompleteSearch(keyword: string): Promise<any> {
        const aggregateQuery = [
            {
                $search: {
                    index: 'default',
                    autocomplete: {
                        query: keyword,
                        path: 'FullAddress',
                        fuzzy: {
                            maxEdits: 1,
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    Country: 1,
                    CountryCode: 1,
                    Region: 1,
                    City: 1,
                    Locality: 1,
                    LocalityCode: 1,
                    District: 1,
                    DistrictCode: 1,
                    PostalCode: 1,
                    FullAddress: 1,
                    score: { $meta: 'searchScore' },
                },
            },
            {
                $sort: {
                    score: -1,
                },
            },
            {
                $limit: 10,
            },
        ];

        return await this.locationModel.aggregate(aggregateQuery as any);
    }

    async createAccommodation(accommodation: Accommodation[]) {
        const session = await this.accommodationModel.startSession();
        try {
            session.startTransaction();

            await this.accommodationModel.deleteMany({});
            await this.accommodationModel.create(accommodation, {
                ordered: true,
                session,
            });

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
            await this.descriptionModel.create(description, {
                ordered: true,
                session,
            });

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
            await this.availabilityModel.create(availability, {
                ordered: true,
                session,
            });

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

    async createGeography(geography: Geography[]) {
        const session = await this.geographyModel.startSession();
        try {
            session.startTransaction();

            await this.geographyModel.deleteMany({});
            await this.geographyModel.create(geography, { ordered: true, session });

            await session.commitTransaction();
            await session.endSession();

            return geography;
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            throw new Error(error);
        }
    }

    async createServices(services: Service[]) {
        const session = await this.serviceModel.startSession();
        try {
            session.startTransaction();

            await this.serviceModel.deleteMany({});
            await this.serviceModel.create(services, { ordered: true, session });

            await session.commitTransaction();
            await session.endSession();

            return services;
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            throw new Error(error);
        }
    }

    async getGeography() {
        return this.geographyModel.find({}).lean().exec();
    }

    async createLocation(location: Location[]) {
        const session = await this.locationModel.startSession();
        try {
            session.startTransaction();

            await this.locationModel.deleteMany({});
            await this.locationModel.create(location, { ordered: true, session });

            await session.commitTransaction();
            await session.endSession();

            return location;
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            throw new Error(error);
        }
    }

    async getListOfAccommodations() {
        return this.accommodationModel.find({}, { _id: 1, AccommodationId: 1 }).lean().exec();
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

    async createPropertyListing(propertyData: Partial<Properties>): Promise<Properties> {
        const [createdListing] = await this.propertyModel.create([propertyData]);
        return createdListing;
    }

    async findByPropertyId(query: { propertyId: string }): Promise<Properties | null> {
        return this.propertyModel.findOne(query).lean().exec();
    }

    async findByPropertyIdUpdateListing(
        query: { propertyId: string },
        update: Partial<Properties>,
        options: { new: boolean; runValidators: boolean },
    ): Promise<Properties | null> {
        return this.propertyModel.findOneAndUpdate(query, update, options).lean().exec();
    }

    async findByQuery(query: Record<string, any>): Promise<Properties[]> {
        return this.propertyModel.find(query).lean().exec();
    }

    async getAvailableProperties(query: Record<string, any>): Promise<Properties[]> {
        return this.propertyModel.find(query).limit(10).lean().exec();
    }

    async getPropertyDetails(propertyId: string): Promise<Properties | null> {
        return this.propertyModel.findOne({ propertyId }).lean().exec();
    }
}
