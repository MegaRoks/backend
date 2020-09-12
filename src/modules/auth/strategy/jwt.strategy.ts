import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from './../../user/repository/user.repository';
import { User } from './../../user/entity/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_KEY,
        });
    }

    public async validate({ user }: { user: User }) {
        const foundUser = await this.userRepository
            .createQueryBuilder()
            .select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.isActive', 'u.role'])
            .from(User, 'u')
            .where('u.id = :userId', { userId: user.id })
            .getOne();

        if (!foundUser) {
            throw new UnauthorizedException('User not found');
        }

        return foundUser;
    }
}
