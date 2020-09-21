import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './../user/repository/user.repository';
import { MailModule } from './../mail/mail.module';

@Module({
    imports: [
        MailModule,
        TypeOrmModule.forFeature([UserRepository]),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule {}
