import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './modules/database/database.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';

@Module({
    imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule],
    controllers: [AppController, AuthController],
    providers: [AppService, AuthService],
})
export class AppModule {}
