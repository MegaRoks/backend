import { Body, Controller, Get, Param, Patch, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDTO } from './../user/dto/createUser.dto';
import { ConfirmEmailDTO } from './dto/confirmEmai.dto';
import { CredentialsDTO } from './dto/credentials.dto';
import { ResetPasswordDTO } from './dto/resetPassword';
import { SignInDTO } from './dto/signIn.dro';
import { SignUpDTO } from './dto/signUp.dto';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { resetPasswordSchema } from './schema/resetPassword.schema';
import { signInSchema } from './schema/signIn.schema';
import { signUpSchema } from './schema/signUp.schema';
import { confirmEmailSchema } from './schema/confirmEmail.schema';



@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/sign-in')
    @ApiOkResponse({
        type: SignInDTO,
        description: 'Sign In method',
    })
    @ApiBody({ schema: signInSchema })
    public async signIn(@Body(ValidationPipe) credentialsDTO: CredentialsDTO): Promise<SignInDTO> {
        return await this.authService.signIn(credentialsDTO);
    }

    @Post('/sign-up')
    @ApiOkResponse({
        type: SignUpDTO,
        description: 'sign Up method',
    })
    @ApiBody({ schema: signUpSchema })
    public async signUp(@Body(ValidationPipe) createUserDTO: CreateUserDTO): Promise<SignUpDTO> {
        const user = await this.authService.signUp(createUserDTO);
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

    @Patch('/confirm-email/:token')
    @ApiOkResponse({
        type: ConfirmEmailDTO,
        description: 'The method for send email for confirm user password',
    })
    @ApiBody({ schema: confirmEmailSchema })
    public async confirmEmail(@Param('token') token: string): Promise<{ message: string }> {
        return await this.authService.confirmEmail(token);
    }

    @Post('/reset-password')
    @ApiOkResponse({
        type: ResetPasswordDTO,
        description: 'The method for send email for reset user password',
    })
    @ApiBody({ schema: resetPasswordSchema })
    public async resetPasswordUser(@Body('email') email: string): Promise<{ message: string }> {
        return await this.authService.resetPasswordUser(email);
    }

    @Patch('/change-password/:token')
    @ApiOkResponse({
        type: ResetPasswordDTO,
        description: 'The method for change password of user',
    })
    @ApiBody({ schema: resetPasswordSchema })
    public async changePasswordUser(
        @Param('token') token: string,
        @Body(ValidationPipe) changePasswordDTO: ChangePasswordDTO,
    ): Promise<{ message: string }> {
        return await this.authService.changePasswordUser(token, changePasswordDTO);
    }
}
