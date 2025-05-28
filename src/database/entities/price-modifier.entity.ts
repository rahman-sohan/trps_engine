import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
class Kind {
  @Prop({ required: true })
  Code: string;

  @Prop({ required: true })
  IsCumulative: string;
}

@Schema({ _id: false })
class VAT {
  @Prop({ type: Boolean, required: false })
  Included: boolean;

  @Prop({ type: Number, required: false })
  Percentage: number;
}

@Schema({ _id: false })
export class Season {
  @Prop({ type: Kind, required: false })
  Kind: Kind;

  @Prop({ required: true })
  StartDate: string;

  @Prop({ required: true })
  EndDate: string;

  @Prop({ required: false })
  NumberOfNights: string;

  @Prop({ required: false })
  MinNumberOfNights: string;

  @Prop({ required: false })
  MaxNumberOfNights: string;

  @Prop({ required: false })
  MaxDate: Date;

  @Prop({ required: false })
  DaysAdvance: string;
  
  @Prop({ required: true })
  Type: string;

  @Prop({ required: false })
  DiscountSupplementType: string;

  @Prop({ required: false })
  Currency: string;

  @Prop({ type: VAT, required: false })
  VAT: VAT;

  @Prop({ required: true })
  Amount: string;
}

@Schema({ collection: 'price_modifiers', timestamps: true })
export class PriceModifier extends Document {
  @Prop({ required: true })
  Id: string;

  @Prop({ required: true })
  Name: string;

  @Prop({ type: [Season], required: false })
  Season: Season[];
}

export const PriceModifierSchema = SchemaFactory.createForClass(PriceModifier); 