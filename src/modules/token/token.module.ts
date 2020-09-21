import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from './strategy/jwt.strategy';
import { UserRepository } from './../user/repository/user.repository';
import { TokenService } from './token.service';

@Global()
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
    providers: [TokenService, JwtStrategy],
    exports: [TokenService, JwtStrategy, PassportModule],
})
export class TokenModule {}
