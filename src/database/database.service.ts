import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/users.entity';
import { Model } from 'mongoose';

@Injectable()
export class DatabaseService {
	constructor(@InjectModel(User.name) private userModel: Model<User>) {}

	async findAllUsers(): Promise<User[]> {
		return this.userModel.find().exec();
	}

	async seedUsers() {
		try {
			const randomDeviceToken = () => {
				return Math.random().toString(36).substring(2, 15);
			};

			for (let i = 0; i < 10; i++) {
				const user = {
					name: `User ${randomDeviceToken()}`,
					deviceToken: randomDeviceToken(),
				};

				await this.userModel.updateOne({ deviceToken: user.deviceToken }, { $set: user }, { upsert: true });
			}
		} catch (error) {
			console.error('users already exists!');
		}
	}
}
