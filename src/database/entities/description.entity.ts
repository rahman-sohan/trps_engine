import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({collection: 'descriptions', timestamps: true})
export class Description extends Document {
  @Prop({ required: true })
  AccommodationId: string;

  @Prop({ type: Object })
  Pictures: object;

  @Prop({ type: [Object] })
  InternationalizedItem: object[];
}

export const DescriptionSchema = SchemaFactory.createForClass(Description);
