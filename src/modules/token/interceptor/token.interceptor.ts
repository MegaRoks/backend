import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Socket } from 'socket.io';

import { UserRepository } from './../../user/repository/user.repository';
import { TokenService } from './../token.service';

@Injectable()
export class TokenInterceptor implements NestInterceptor {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly tokenService: TokenService,
    ) { }
    
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        console.log('Before...');

        const client: Socket = context.switchToWs().getClient<Socket>();
        const token: string = client.handshake.query.token;
        console.log('context', token);

        return next.handle().pipe(map((token) => ({ token })));
    }
}
