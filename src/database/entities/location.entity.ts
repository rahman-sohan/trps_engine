import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LocationDocument = Location & Document;

@Schema({ collection: 'locations', timestamps: true })
export class Location {
    @Prop({ required: true })
    Country: string;

    @Prop({ required: true })
    Region: string;

    @Prop({ required: true })
    City: string;

    @Prop({ required: true })
    Locality: string;

    @Prop()
    LocalityCode?: string;

    @Prop({ required: true })
    District: string;

    @Prop()
    DistrictCode?: string;

    @Prop()
    PostalCode?: string;

    @Prop({ required: true, index: true })
    FullAddress: string;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
