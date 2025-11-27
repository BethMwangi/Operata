import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const rawPort = configService.get<string>('PORT');
  const port = rawPort ? Number(rawPort) : 4000;

  app.setGlobalPrefix('api', {
    exclude: ['health', 'metrics'],
  });

  const config = new DocumentBuilder()
    .setTitle('Payment Service')
    .setDescription('Payment processing service API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('docs', app as any, document);

  await app.listen(port);
}
bootstrap();
