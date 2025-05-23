import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ timestamps: true, collection: 'services' })
export class Service {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);
