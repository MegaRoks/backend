import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserDTO } from './../user/dto/createUser.dto';
import { User } from './../user/entity/user.entity';
import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { CredentialsDto } from './dto/credentials.dto';
import { SignInUserDTO } from './dto/singInUser.dro';
import { SingUpDTO } from './dto/singUp.dto';
import { signInSchema } from './schema/signIn.schema';
import { singUpSchema } from './schema/singUp.schema';

@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/sign-in')
    @ApiOkResponse({
        type: SignInUserDTO,
        description: 'Sign In method',
    })
    @ApiBody({ schema: signInSchema })
    public async signIn(@Body(ValidationPipe) credentialsDto: CredentialsDto): Promise<SignInUserDTO> {
        return await this.authService.signIn(credentialsDto);
    }

    @Post('/sing-up')
    @ApiOkResponse({
        type: SingUpDTO,
        description: 'Sing Up method',
    })
    @ApiBody({ schema: singUpSchema })
    public async signUp(@Body(ValidationPipe) createUserDto: CreateUserDTO): Promise<SingUpDTO> {
        const user = await this.authService.signUp(createUserDto);
        return {
            user,
            message: 'Successful registration',
        };
    }

    @Post('/logout')
    @ApiOkResponse({
        description: 'Logout method',
    })
    public logout(): string {
        return this.authService.logout();
    }

    @Get('/me')
    @UseGuards(AuthGuard())
    getMe(@GetUser() user: User): User {
        return user;
    }
}
