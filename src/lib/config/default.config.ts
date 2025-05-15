const dotenv = require('dotenv');
dotenv.config();

export const APP_CONFIG = {
	MONGO_URI: process.env.MONGO_URI ?? 'mongodb+srv://sohanur:jarJCRNjX5pSFYYb@cluster0.wkkexqu.mongodb.net/property_engine?retryWrites=true&w=majority&appName=Cluster0',
};

export enum FeedUrls{
	ACCOMMODATIONS = 'https://feeds.avantio.com/accommodations/6d1885d0b17f961c8047092f6b4121a2',
	DESCRIPTIONS = 'https://feeds.avantio.com/descriptions/6d1885d0b17f961c8047092f6b4121a2',
	AVAILABILITIES = 'https://feeds.avantio.com/availabilities/6d1885d0b17f961c8047092f6b4121a2',
	RATES = 'https://feeds.avantio.com/rates/6d1885d0b17f961c8047092f6b4121a2',
	KINDS = 'https://feeds.avantio.com/kinds/6d1885d0b17f961c8047092f6b4121a2',
	GEOGRAPHIC_AREAS = 'https://feeds.avantio.com/geographicareas/6d1885d0b17f961c8047092f6b4121a2',
	OCCUPATIONAL_RULES = 'https://feeds.avantio.com/occupationalrules/6d1885d0b17f961c8047092f6b4121a2',
	PRICE_MODIFIERS = 'https://feeds.avantio.com/pricemodifiers/6d1885d0b17f961c8047092f6b4121a2',
	SERVICES = 'https://feeds.avantio.com/services/6d1885d0b17f961c8047092f6b4121a2',
}
