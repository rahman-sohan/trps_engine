import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({collection: 'accommodations', timestamps: true})
export class Accommodation extends Document {
  @Prop({ required: true })
  AccommodationId: string;

  @Prop()
  UserId: string;

  @Prop()
  Company: string;

  @Prop()
  CompanyId: string;

  @Prop()
  AccommodationName: string;

  @Prop()
  IdGallery: string;

  @Prop()
  OccupationalRuleId: string;

  @Prop()
  PriceModifierId: string;

  @Prop()
  TouristicRegistrationNumber: string;

  @Prop()
  Purpose: string;

  @Prop()
  UserKind: string;

  @Prop({ type: Object })
  MasterKind: object;

  @Prop({ type: Object })
  LocalizationData: object;

  @Prop()
  AccommodationUnits: string;

  @Prop()
  Currency: string;

  @Prop({ type: Object })
  VAT: object;

  @Prop({ type: Object })
  Features: object;

  @Prop({ type: Object })
  CheckInCheckOutInfo: object;
}

export const AccommodationSchema = SchemaFactory.createForClass(Accommodation);
