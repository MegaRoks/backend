import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';

import { User } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { CreateUserDTO } from './dto/createUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { FindUsersDTO } from './dto/findUsers.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private mailerService: MailerService,
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
        return await this.userRepository.updateUser(user.id, updateUserDTO).then(() => {
            return user;
        });
    }

    public async updateUser(userId: string, updateUserDTO: UpdateUserDTO): Promise<User> {
        const user = await this.userRepository.getUserById(userId);

        if (updateUserDTO.email) {
            const confirmationToken = user.getRandomStringBytes();
            const mail: ISendMailOptions = {
                to: updateUserDTO.email,
                from: process.env.COMPANY_EMAIL,
                subject: 'Confirmation email',
                template: 'confirmation-email',
                context: {
                    token: confirmationToken,
                    url: process.env.SERVER_URL,
                },
            };
            await this.mailerService.sendMail(mail).catch((error) => console.error('error', error));
            updateUserDTO.confirmationToken = confirmationToken;
        }

        if (updateUserDTO.password && updateUserDTO.passwordConfirmation) {
            if (updateUserDTO.password === updateUserDTO.passwordConfirmation) {
                const recoverToken = user.getRandomStringBytes();
                const mail: ISendMailOptions = {
                    to: updateUserDTO.email ? updateUserDTO.email : user.email,
                    from: process.env.COMPANY_EMAIL,
                    subject: 'Reset password',
                    template: 'reset-password',
                    context: {
                        token: recoverToken,
                        url: process.env.SERVER_URL,
                    },
                };
                await this.mailerService.sendMail(mail).catch((error) => console.error('error', error));
                const { password, salt } = await user.getPasswordAndSalt(updateUserDTO.password);
                updateUserDTO.recoverToken = recoverToken;
                updateUserDTO.password = password;
                updateUserDTO.salt = salt;
            } else {
                throw new UnprocessableEntityException('Password mismatch');
            }
        }

        return await this.userRepository.updateUser(user.id, updateUserDTO).then(() => {
            return user;
        });
    }

    public async deleteUser(userId: string) {
        const user = await this.userRepository.getUserById(userId);
        return await this.userRepository.deleteUser(user.id);
    }

    public async findUsers(queryDTO: FindUsersDTO): Promise<{ users: User[]; total: number }> {
        return await this.userRepository.findUsers(queryDTO);
    }
}
