import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from './../mail/mail.module';

@Module({
    imports: [MailModule, TypeOrmModule.forFeature([UserRepository])],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
