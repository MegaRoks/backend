import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from './repository/users.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { User } from './entity/user.entity';
import { UserRole } from './types/userRole.type';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

   public async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
        if (createUserDto.password != createUserDto.passwordConfirmation) {
            throw new UnprocessableEntityException('Password mismatch');
        } else {
            return this.userRepository.createUser(createUserDto, UserRole.admin);
        }
    }
}
