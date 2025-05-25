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
class Details {
    @Prop({ type: Capacity, required: true }) capacity: Capacity;
    @Prop({ type: Area }) area?: Area;
    @Prop({ type: Object, required: true }) amenities: Object;
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
    @Prop({ type: Object, default: {} })
    availablePeriods: Object;
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

@Schema({ collection: 'properties', timestamps: true })
export class Properties extends Document {
    @Prop({ required: true, unique: true })
    propertyId: string;
    
    @Prop({ required: true }) 
    name: string;

    @Prop({ required: true }) 
    fullAddress: string;

    @Prop({ required: true }) 
    type: string;

    @Prop({ required: true }) 
    description: string;
    
    @Prop({ type: Location, required: true }) 
    location: Location;

    @Prop({ type: Details, required: true })
    details: Details;
    
    @Prop({ type: Pricing, required: true })
    pricing: Pricing;

    @Prop({ type: Availability, required: true }) 
    availability: Availability;

    @Prop({ type: [Image], default: [] }) 
    images: Image[];

    @Prop({ type: Rules }) 
    rules?: Rules;

    @Prop({ type: Object, default: {} }) 
    booking_data: Object;

    @Prop({ type: Object, default: {} }) 
    extras: Object;

    @Prop({ type: Object, default: {} }) 
    features: Object;

    @Prop({ default: Date.now }) 
    lastUpdated: Date;

    @Prop({ type: Object, default: {} }) 
    amenities: Object;

    @Prop({ default: 'active' })
    status: string;

    @Prop({ default: '0' }) 
    rating: string;

    @Prop({ type: Object, default: {} }) 
    tags: Object;

    @Prop({ type: Object, default: {} }) 
    reviews: Object;
}

export const PropertiesSchema = SchemaFactory.createForClass(Properties);

