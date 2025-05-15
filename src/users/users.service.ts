import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
	constructor(private readonly databaseServices: DatabaseService) {}

	async seedUsers() {
		await this.databaseServices.seedUsers();
	}

	async getAllUsersDeviceTokens() {
		const users = await this.databaseServices.findAllUsers();

		return users.map((user) => user.deviceToken);
	}
}
