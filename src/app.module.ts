import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PropertyModule } from './property/property.module';
import { DatabaseModule } from './database/database.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    PropertyModule, 
    DatabaseModule,
    ScheduleModule.forRoot()
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
