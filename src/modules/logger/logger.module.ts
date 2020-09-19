import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';

import { winstonConfig } from './winston.config';
import { LoggerInterceptor } from './interceptor/logger.interceptor';

@Module({
    imports: [WinstonModule.forRoot(winstonConfig)],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: LoggerInterceptor,
        },
    ],
})
export class LoggerModule {}
