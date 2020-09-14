import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { User } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    public async createUser(createUserDTO: CreateUserDTO): Promise<User> {
        if (createUserDTO.password === createUserDTO.passwordConfirmation) {
            return await this.userRepository.createUser(createUserDTO);
        } else {
            throw new UnprocessableEntityException('Password mismatch');
        }
    }

    public async updateUserRole(userId: string, updateUserDTO: UpdateUserDTO): Promise<User> {
        const user = await this.userRepository.getUserById(userId);
        const { role } = updateUserDTO;

        user.role = role ? role : user.role;

        return await this.userRepository.updateUser(userId, updateUserDTO).then(() => {
            return user;
        });
    }

    public async updateUser(userId: string, updateUserDTO: UpdateUserDTO): Promise<User> {
        const user = await this.userRepository.getUserById(userId);
        const { firstName, lastName, email } = updateUserDTO;

        user.firstName = firstName ? firstName : user.firstName;
        user.lastName = lastName ? lastName : user.lastName;
        user.email = email ? email : user.email;

        return await this.userRepository.updateUser(userId, updateUserDTO).then(() => {
            return user;
        });
    }

    public async deleteUser(userId: string) {
        return await this.userRepository.deleteUser(userId);
    }
}
