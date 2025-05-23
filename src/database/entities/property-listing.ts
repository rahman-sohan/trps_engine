import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class CodeName {
    @Prop({ required: true })
    code: string;

    @Prop({ required: true })
    name: string;
}

@Schema({ _id: false })
class Address {
    @Prop() street?: string;
    @Prop() number?: string;
    @Prop() floor?: string;
    @Prop() door?: string;
}

@Schema({ _id: false })
class Coordinates {
    @Prop() latitude: string;
    @Prop() longitude: string;
}

@Schema({ _id: false })
class Location {
    @Prop({ type: CodeName, required: true }) country: CodeName;
    @Prop({ type: CodeName, required: true }) region: CodeName;
    @Prop({ type: CodeName, required: true }) city: CodeName;
    @Prop({ type: CodeName, required: true }) province: CodeName;
    @Prop({ type: CodeName }) locality?: CodeName;
    @Prop() postalCode?: string;
    @Prop({ type: Address }) address?: Address;
    @Prop({ type: Coordinates }) coordinates?: Coordinates;
}

@Schema({ _id: false })
class Capacity {
    @Prop({ required: false }) total?: string;
    @Prop({ required: false }) bedrooms?: string;
    @Prop() bathrooms?: string;
    @Prop() minOccupation?: string;
    @Prop() maxOccupation?: string;
}

@Schema({ _id: false })
class Area {
    @Prop() size: string;
    @Prop() unit: string;
}

@Schema({ _id: false })
class Amenities {
    @Prop({ default: false }) hasTV: boolean;
    @Prop({ default: false }) hasSatelliteTV: boolean;
    @Prop({ default: false }) hasWifi: boolean;
    @Prop({ default: false }) hasElevator: boolean;
    @Prop({ default: false }) hasGarden: boolean;
    @Prop({ default: false }) hasParking: boolean;
    @Prop({ default: false }) hasPool: boolean;
    @Prop({ default: false }) hasAirConditioning: boolean;
    @Prop({ default: false }) hasHeating: boolean;
    @Prop({ default: false }) hasWashingMachine: boolean;
    @Prop({ default: false }) hasDishwasher: boolean;
    @Prop({ default: false }) hasTerrace: boolean;
    @Prop({ default: false }) allowsPets: boolean;
}

@Schema({ _id: false })
class Details {
    @Prop({ type: Capacity, required: true }) capacity: Capacity;
    @Prop({ type: Area }) area?: Area;
    @Prop({ type: Amenities, required: true }) amenities: Amenities;
}

@Schema({ _id: false })
class Pricing {
    @Prop({ required: true }) currency: string;
    @Prop({ required: true }) basePrice: string;
    @Prop() cleaningFee?: string;
    @Prop() securityDeposit?: string;
    @Prop({ default: true }) vatIncluded: boolean;
}

@Schema({ _id: false })
class AvailablePeriod {
    @Prop({ required: true }) startDate: Date;
    @Prop({ required: true }) endDate: Date;
    @Prop({ required: true }) state: string;
}

@Schema({ _id: false })
class Availability {
    @Prop({ default: false }) instantBooking: boolean;
    @Prop({ default: 1 }) minDaysNotice: string;
    @Prop({ type: [AvailablePeriod], default: [] })
    availablePeriods: AvailablePeriod[];
}

@Schema({ _id: false })
class Image {
    @Prop({ required: true }) url: string;
    @Prop() caption?: string;
    @Prop({ default: false }) isPrimary: boolean;
}

@Schema({ _id: false })
class CheckIn {
    @Prop() from?: string;
    @Prop() to?: string;
}

@Schema({ _id: false })
class Rules {
    @Prop({ type: CheckIn }) checkIn?: CheckIn;
    @Prop() checkOut?: string;
    @Prop() minimumStay?: string;
    @Prop() cancellationPolicy?: string;
}

@Schema({ _id: false })
class Rating {
    @Prop() average: string;
    @Prop() count: string;
}

@Schema({ collection: 'property_listings', timestamps: true })
export class PropertyListing extends Document {
    @Prop({ required: true, unique: true }) propertyId: string;
    @Prop({ required: true }) name: string;
    @Prop({ required: true }) type: string;
    @Prop({ required: true }) description: string;
    @Prop({ type: Location, required: true }) location: Location;
    @Prop({ type: Details, required: true }) details: Details;
    @Prop({ type: Pricing, required: true }) pricing: Pricing;
    @Prop({ type: Availability, required: true }) availability: Availability;
    @Prop({ type: [Image], default: [] }) images: Image[];
    @Prop({ type: Rules }) rules?: Rules;
    @Prop({ type: [String], default: [] }) languages: string[];
    @Prop({ default: Date.now }) lastUpdated: Date;
    @Prop({ default: 'active' }) status: string;
    @Prop({ type: Rating }) rating?: Rating;
}

export const PropertyListingSchema = SchemaFactory.createForClass(PropertyListing);

// Indexes
PropertyListingSchema.index({ 'location.country.code': 1 });
PropertyListingSchema.index({ status: 1 });
PropertyListingSchema.index({
    'location.country.name': 'text',
    'location.city.name': 'text',
    'location.region.name': 'text',
    name: 'text',
    description: 'text',
});
