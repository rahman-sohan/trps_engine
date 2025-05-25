import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PropertyModule } from './property/property.module';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SearchModule } from './search/search.module';
import { StartupTimeProvider } from './services/startup-time.provider';

@Module({
    imports: [PropertyModule, DatabaseModule, ScheduleModule.forRoot(), SearchModule],
    controllers: [AppController],
    providers: [StartupTimeProvider],
})
export class AppModule {}
