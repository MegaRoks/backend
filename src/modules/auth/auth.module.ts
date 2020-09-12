import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './../user/repository/user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRepository]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: {
                expiresIn: process.env.JWT_EXPIRES,
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
