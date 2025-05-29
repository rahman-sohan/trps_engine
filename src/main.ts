import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './errors/allException.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: '*',
    });

    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
    }));
    
    await app.startAllMicroservices();
    app.useGlobalFilters(new AllExceptionsFilter());


    await app.listen(process.env.PORT ?? 3000);
    console.log('----------------PROPERTY ENGINE---------------------');
    console.log('APP IS RUNNING ON PORT', process.env.PORT ?? 3000);
}

bootstrap();
    