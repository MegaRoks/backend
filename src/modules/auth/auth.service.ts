import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from './../user/dto/createUser.dto';

import { User } from './../user/entity/user.entity';
import { UserRepository } from './../user/repository/user.repository';
import { CredentialsDto } from './dto/credentials.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService,
    ) {}

    public async signIn(credentialsDto: CredentialsDto): Promise<{ token: string }> {
        const user = await this.userRepository.checkCredentials(credentialsDto);       
        const jwtPayload = { user };
        const token = this.jwtService.sign(jwtPayload);

        return { token };
    }

    public async signUp(createUserDto: CreateUserDTO): Promise<User> {
        if (createUserDto.password === createUserDto.passwordConfirmation) {
            return await this.userRepository.createUser(createUserDto);
        } else {
            throw new UnprocessableEntityException('Passwords do not match');
        }
    }

    public logout(): string {
        return 'logout method';
    }
}
