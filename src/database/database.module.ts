import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/users.entity';
import { APP_CONFIG } from 'src/lib/config/default.config';

@Module({
	imports: [
		MongooseModule.forRoot(APP_CONFIG.MONGO_URI),
		MongooseModule.forFeature([
			{
				name: User.name,
				schema: UserSchema,
			},
		]),
	],
	providers: [DatabaseService],
	exports: [DatabaseService],
})
export class DatabaseModule {}
