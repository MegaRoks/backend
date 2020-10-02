import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { FindUsersDTO } from './dto/findUsers.dto';
import { FilterUsersDTO } from './dto/filterUsers.dto';
import { MailService } from './../mail/mail.service';


@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
        private readonly mailService: MailService,
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

        return await this.userRepository.updateUser(user.id, updateUserDTO);
    }

    public async updateUser(userId: string, updateUserDTO: UpdateUserDTO): Promise<User> {
        const user = await this.userRepository.getUserById(userId);

        if (updateUserDTO.email) {
            const confirmationToken = user.getRandomStringBytes();

            await this.mailService.sendMailAboutMailIsChanged(user.email);

            updateUserDTO.confirmationToken = confirmationToken;
        }

        if (updateUserDTO.password && updateUserDTO.passwordConfirmation) {
            if (updateUserDTO.password === updateUserDTO.passwordConfirmation) {
                const recoverToken = user.getRandomStringBytes();
                const { password, salt } = await user.getPasswordAndSalt(updateUserDTO.password);

                await this.mailService.sendMailAboutPasswordIsChanged(user.email);

                updateUserDTO.recoverToken = recoverToken;
                updateUserDTO.password = password;
                updateUserDTO.salt = salt;
            } else {
                throw new UnprocessableEntityException('Password mismatch');
            }
        }

        await this.userRepository.updateUser(user.id, updateUserDTO);

        return user;
    }

    public async deleteUser(userId: string): Promise<void> {
        const user = await this.userRepository.getUserById(userId);
        await this.userRepository.deleteUser(user.id);
    }

    public async findUsers(queryDTO: FindUsersDTO): Promise<FilterUsersDTO> {
        return await this.userRepository.findUsers(queryDTO);
    }
}
