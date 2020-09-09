import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    public login(): string {
        return 'login method';
    }

    public singup(): string {
        return 'singup method';
    }

    public logout(): string {
        return 'logout method';
    }
}
