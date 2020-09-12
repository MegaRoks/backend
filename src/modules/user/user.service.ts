import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/createUser.dto';
import { User } from './entity/user.entity';
import { ChangeUserRoleDTO } from './dto/changeUserRole.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
    ) {}

    public async createUser(createUserDTO: CreateUserDTO): Promise<User> {
        if (createUserDTO.password === createUserDTO.passwordConfirmation) {
            return this.userRepository.createUser(createUserDTO);
        } else {
            throw new UnprocessableEntityException('Password mismatch');
        }
    }

    public async changeUserRole(id: string, changeUserRoleDTO: ChangeUserRoleDTO): Promise<User> {
        return this.userRepository.changeUserRole(id, changeUserRoleDTO);
    }
}
