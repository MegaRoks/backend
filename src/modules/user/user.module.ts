import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { UserRepository } from './repository/user.repository';
import { UserService } from './user.service';
import { UserController } from './user.controller';


@Module({
    imports: [TypeOrmModule.forFeature([UserRepository]), PassportModule.register({ defaultStrategy: 'jwt' })],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
