import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe());
    
    await app.startAllMicroservices();

    await app.listen(process.env.PORT ?? 3000);
    console.log('----------------PROPERTY ENGINE---------------------');
    console.log('APP IS RUNNING ON PORT', process.env.PORT ?? 3000);
}

bootstrap();
