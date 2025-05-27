import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
class Kind {
  @Prop({ required: true })
  Code: string;

  @Prop({ required: true })
  IsCumulative: string;
}

@Schema()
class Season {
  @Prop({ type: Kind, required: false })
  Kind: Kind;

  @Prop({ required: true })
  StartDate: string;

  @Prop({ required: true })
  EndDate: string;

  @Prop({ required: true })
  NumberOfNights: string;

  @Prop({ required: true })
  Type: string;

  @Prop({ required: true })
  DiscountSupplementType: string;

  @Prop({ required: true })
  Amount: string;
}

@Schema()
export class PriceModifier extends Document {
  @Prop({ required: true })
  Id: string;

  @Prop({ required: true })
  Name: string;

  @Prop({ type: [Season], required: false })
  Season: Season[];
}

export const PriceModifierSchema = SchemaFactory.createForClass(PriceModifier); 