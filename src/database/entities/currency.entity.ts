import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'currency_conversion' })
export class CurrencyConversion extends Document {
    @Prop({ required: true })
    fromCurrency: string;

    @Prop({ required: true })
    toCurrency: string;

    @Prop({ required: true, type: Number })
    rate: number;

    @Prop({ required: true })
    lastUpdated: Date;
}

export const CurrencyConversionSchema = SchemaFactory.createForClass(CurrencyConversion);
