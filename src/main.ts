import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';

import { AppModule } from './app.module';
import { winstonConfig } from './modules/logger/winston.config';

async function bootstrap() {
    const logger = WinstonModule.createLogger(winstonConfig);
    const app = await NestFactory.create(AppModule, { logger });
    const options = new DocumentBuilder().setTitle('Service API').setDescription('API description').setVersion('0.0.1').addBearerAuth().build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup('swagger', app, document);

    await app.listen(process.env.SERVER_PORT);
}
bootstrap();
