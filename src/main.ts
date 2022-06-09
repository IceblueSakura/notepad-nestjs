import { NestFactory } from '@nestjs/core';
import { NotebookModule } from './notebook.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(NotebookModule);
  app.enableCors(); // 允许跨域请求

  const config = new DocumentBuilder()
    .setTitle('记事本')
    .setDescription('记事本的基于Swagger的API介绍')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(3001);
}
bootstrap();
