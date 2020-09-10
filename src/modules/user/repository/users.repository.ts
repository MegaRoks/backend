import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';

import { User } from './../entity/user.entity';
import { CreateUserDto } from './../dto/createUser.dto';
import { UserRole } from './../types/userRole.type';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async createUser(createUserDto: CreateUserDto, role: UserRole): Promise<User> {
        const { email, firstName, lastName, password } = createUserDto;

        const user = this.create();
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.role = role;
        user.confirmationToken = randomBytes(32).toString('hex');
        user.salt = await genSalt();
        user.password = await this.hashPassword(password, user.salt);
        try {
            await user.save();
            delete user.password;
            delete user.salt;
            return user;
        } catch (error) {
            if (error.code.toString() === '23505') {
                throw new ConflictException('Email address already in use');
            } else {
                throw new InternalServerErrorException('Error while saving user to database');
            }
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return hash(password, salt);
    }
}
