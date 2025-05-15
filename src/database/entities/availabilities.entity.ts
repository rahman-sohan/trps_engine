import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({collection: 'availabilities', timestamps: true})
export class Availability extends Document {
  @Prop({ required: true })
  AccommodationId: string;

  @Prop({ required: true })
  OccupationalRuleId: string;

  @Prop({ type: Object })
  Availabilities: object;

  @Prop()
  MinDaysNotice: string;
}

export const AvailabilitySchema = SchemaFactory.createForClass(Availability);
