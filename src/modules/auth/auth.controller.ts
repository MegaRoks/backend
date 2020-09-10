import { Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/login')
    @ApiOkResponse({
        description: 'Login method',
    })
    public login(): string {
        return this.authService.login();
    }

    @Post('/singup')
    @ApiOkResponse({
        description: 'Singup method',
    })
    public singup(): string {
        return this.authService.login();
    }

    @Post('/logout')
    @ApiOkResponse({
        description: 'Logout method',
    })
    public logout(): string {
        return this.authService.login();
    }
}
