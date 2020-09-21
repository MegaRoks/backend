import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) {}

    public signToken(jwtPayload: any): string {
        return this.jwtService.sign(jwtPayload);
    }

    public verifyToken(token: string): any {
        return this.jwtService.verify(token);
    }
}
