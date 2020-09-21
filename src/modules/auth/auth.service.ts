import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './../user/entity/user.entity';
import { UserRepository } from './../user/repository/user.repository';
import { CredentialsDTO } from './dto/credentials.dto';
import { ChangePasswordDTO } from './dto/changePassword.dto';
import { CreateUserDTO } from './../user/dto/createUser.dto';
import { UpdateUserDTO } from './../user/dto/updateUser.dto';
import { MailService } from './../mail/mail.service';
import { TokenService } from '../token/token.service';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private tokenService: TokenService,
        private mailService: MailService,
    ) {}

    public async signIn(credentialsDTO: CredentialsDTO): Promise<{ token: string }> {
        const { email, password } = credentialsDTO;
        const user = await this.userRepository.getUserByEmailWithCredentials(email);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isCheckPassword = await user.checkPassword(password);

        if (user && isCheckPassword) {
            delete user.password;
            delete user.salt;
            const jwtPayload = { user };
            const token = this.tokenService.signToken(jwtPayload);

            return { token };
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    public async signUp(createUserDTO: CreateUserDTO): Promise<User> {
        if (createUserDTO.password === createUserDTO.passwordConfirmation) {
            const user = await this.userRepository.createUser(createUserDTO);

            await this.mailService.sendMailAboutMailConfirming(user.email, user.confirmationToken);

            return user;
        } else {
            throw new UnprocessableEntityException('Passwords do not match');
        }
    }

    public logout(): string {
        return 'logout method';
    }

    public async confirmEmail(confirmationToken: string): Promise<{ message: string }> {
        const user = await this.userRepository.getUserByConfirmationToken(confirmationToken);
        const updateUserDTO: UpdateUserDTO = {
            confirmationToken: null,
            isActive: true,
        };

        await this.userRepository.updateUser(user.id, updateUserDTO);

        return { message: 'Email successfully confirmed' };
    }

    public async resetPasswordUser(email: string): Promise<{ message: string }> {
        const user = await this.userRepository.getUserByEmail(email);
        const recoverToken = user.getRandomStringBytes();
        const updateUserDTO: UpdateUserDTO = { recoverToken };

        await this.mailService.sendMailAboutPasswordChanging(user.email, recoverToken);
        await this.userRepository.updateUser(user.id, updateUserDTO);

        return { message: 'An email was sent with instructions on how to reset your password' };
    }

    public async changePasswordUser(recoverToken: string, changePasswordDTO: ChangePasswordDTO): Promise<{ message: string }> {
        if (changePasswordDTO.password === changePasswordDTO.passwordConfirmation) {
            const user = await this.userRepository.getUserByRecoverToken(recoverToken);
            const { password, salt } = await user.getPasswordAndSalt(changePasswordDTO.password);
            const updateUserDTO: UpdateUserDTO = {
                recoverToken: null,
                password,
                salt,
            };

            await this.mailService.sendMailAboutPasswordIsChanged(user.email);
            await this.userRepository.updateUser(user.id, updateUserDTO);

            return { message: 'Password changed successfully' };
        } else {
            throw new UnprocessableEntityException('Passwords do not match');
        }
    }
}
