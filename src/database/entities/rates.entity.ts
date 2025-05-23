import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'rates', timestamps: true })
export class Rate extends Document {
    @Prop({ required: true })
    AccommodationId: string;

    @Prop()
    Capacity: string;

    @Prop({ type: Object })
    Rates: object;

    @Prop({ type: Object })
    VAT: object;
}

export const RateSchema = SchemaFactory.createForClass(Rate);
