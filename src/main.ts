import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppBootstrapManager } from './app-bootstrap.manager';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Anchor Watch')
    .setDescription('The Anchor Watch API documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(process.env.SWAGGER_SERVER_URL)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  AppBootstrapManager.setAppDefaults(app);

  await app.listen(process.env.PORT || 3005);
}
bootstrap();
