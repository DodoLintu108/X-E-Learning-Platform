import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as path from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const uploadPath = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }
  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3001', // Allow requests from the frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow specific HTTP methods
    credentials: true, // Allow credentials if needed
  });

  await app.listen(3000); // Backend listening on port 3000
}
bootstrap();
