import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from './../../user/repository/user.repository';
import { TokenService } from './../token.service';
import { IJwtPayload } from './../interfaces/jwtPayload.interface';

@Injectable()
export class TokenGuard implements CanActivate {
    constructor(
        @InjectRepository(UserRepository)
        private readonly tokenService: TokenService,
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const client: Socket = context.switchToWs().getClient<Socket>();
            const token: string = client.handshake.query.token;
            const payload: IJwtPayload = this.tokenService.verifyToken(token);

            if (payload) {
                console.log(1);

                return true;
            } else {
                console.log(2);

                return false;
            }
        } catch (err) {
            throw new WsException('Invalid credentials');
        }
    }
}
