import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GeographyDocument = Geography & Document;

@Schema({ collection: 'geographies', timestamps: true })
export class Geography {
    @Prop({ required: true })
    CountryCode: string;

    @Prop({ required: true })
    Name: string;

    @Prop({ type: Object })
    Regions: Record<string, any>;
}

export const GeographySchema = SchemaFactory.createForClass(Geography);
