import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class Guests {
	@Prop({ required: false })
	adults: number;

	@Prop({ required: false })
	children: number;
}

@Schema({ _id: false })
export class SearchParams {
	@Prop({ required: false })
	checkInDate: Date | null;

	@Prop({ required: false })
	checkOutDate: Date | null;

	@Prop({ required: false })
	guests: Guests;

	@Prop({ required: false })
	regionId: string;

	@Prop({ required: false })
	countryCode: string;

	@Prop({ required: false })
	page: number;

	@Prop({ required: false })
	pageSize: number;
}

@Schema({ collection: 'search_session' })
export class SearchSession extends Document {
	@Prop({ required: true })
	sessionId: string;

	@Prop({ required: false, type: SearchParams })
	searchParams: SearchParams;

	@Prop({ required: false })
	searchParamsHash: string;

	@Prop({ required: false })
	searchFinished: boolean;

	@Prop({ required: false })
	totalProperties: number;

	@Prop({ required: false })
	propertiesIds: string[];

	@Prop({ required: false })
	createdAt: Date;

	@Prop({ required: false })
	expiresAt: Date;
}

export const SearchSessionSchema = SchemaFactory.createForClass(SearchSession);
SearchSessionSchema.index({ expiresAt: -1 }, { expireAfterSeconds: 2 * 60 * 60 });