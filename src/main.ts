import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  const config = new DocumentBuilder()
    .setTitle('RCA-SDA Attendance MIS')
    .setDescription('The RCA-SDA Attendance API description')
    .setVersion('1.0')
    .addTag('RCA SDA Attendance MIS')
    .addBearerAuth({
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
      
    }, 'access-token')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);


  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 3000)
  
  app.enableCors({ credentials: true, origin: "http://localhost:3000" });

  await app.listen(port);
  console.log(`The server is running on port ${port}`);
  
}
bootstrap();
