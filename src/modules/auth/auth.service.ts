import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
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
        const { email, password } = credentialsDto;
        const user = await this.userRepository.createQueryBuilder()
            .select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.isActive', 'u.role', 'u.salt', 'u.password'])
            .from(User, 'u')
            .where('u.email = :email', { email })
            .andWhere('u.isActive = :isActive', { isActive: true })
            .getOne();
        
        if (!user) {
            throw new NotFoundException('User not found');
        }
        
        const isCheckPassword = await user.checkPassword(password);

        if (user && isCheckPassword) {
            delete user.password;
            delete user.salt;
            const jwtPayload = { user };
            const token = this.jwtService.sign(jwtPayload);

            return { token };
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }

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
