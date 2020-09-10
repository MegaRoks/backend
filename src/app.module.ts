import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './modules/database/database.module';
import { AuthController } from './modules/auth/auth.controller';
import { AuthService } from './modules/auth/auth.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
    imports: [ConfigModule.forRoot(), DatabaseModule, AuthModule, UserModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AppModule {}
