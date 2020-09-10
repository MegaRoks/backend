import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRepository } from './repository/users.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';

@Module({ imports: [TypeOrmModule.forFeature([UserRepository])], providers: [UserService], controllers: [UserController] })
export class UserModule {}
