import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  // Enable CORS for development
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Vite dev server default ports
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
  });
  
  // Enable validation pipes
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));
  
  // Get port from environment variables or use default
  const port = configService.get<number>('PORT') || 3000;
  
  await app.listen(port);
  console.log(`BookAgent API is running on: http://localhost:${port}`);
}
bootstrap();
