import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OccupationalRuleDocument = OccupationalRule & Document;

@Schema({ _id: false })
class DaySchema {
  @Prop({ type: [String], default: [] })
  WeekDay: string[];

  @Prop({ type: [String], default: [] })
  MonthDay: string[];
}

const DaySchemaFactory = SchemaFactory.createForClass(DaySchema);

@Schema({ _id: false })
class SeasonSchema {
  @Prop({ required: true })
  StartDate: string;

  @Prop({ required: true })
  EndDate: string;

  @Prop({ required: true })
  MinimumNights: string;

  @Prop({ required: true })
  MinimumNightsOnline: string;

  @Prop({ type: DaySchemaFactory, required: true })
  CheckInDays: DaySchema;

  @Prop({ type: DaySchemaFactory, required: true })
  CheckOutDays: DaySchema;
}

const SeasonSchemaFactory = SchemaFactory.createForClass(SeasonSchema);

@Schema({ collection: 'occupational_rules', timestamps: true })
export class OccupationalRule {
  @Prop({ required: true })
  Id: string;

  @Prop({ required: true })
  Name: string;

  @Prop({ type: SeasonSchemaFactory, required: true })
  Season: SeasonSchema;
}

export const OccupationalRuleSchema = SchemaFactory.createForClass(OccupationalRule);
