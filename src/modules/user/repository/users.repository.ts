import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { genSalt, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';

import { User } from './../entity/user.entity';
import { CreateUserDTO } from './../dto/createUser.dto';
import { ChangeUserRoleDTO } from './../dto/changeUserRole.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public async createUser(createUserDTO: CreateUserDTO): Promise<User> {
        const { email, firstName, lastName, password } = createUserDTO;

        const user = this.create();
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        user.confirmationToken = randomBytes(32).toString('hex');
        user.salt = await genSalt();
        user.password = await this.hashPassword(password, user.salt);

        try {
            const result = await this.createQueryBuilder()
                .insert()
                .into(User)
                .values(user)
                .returning(['id', 'firstName', 'lastName', 'email'])
                .execute();

            return Object.assign(result.generatedMaps[0]);
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

    public async changeUserRole(changeUserRoleDTO: ChangeUserRoleDTO): Promise<User> {
        const user = await this.createQueryBuilder()
            .select(['u.id', 'u.role'])
            .from(User, 'u')
            .where('u.id = :userId', { userId: changeUserRoleDTO.id })
            .getOne();
        
        if (user) {
            try {
                const result = await this.createQueryBuilder()
                    .update(User)
                    .set({ role: changeUserRoleDTO.role })
                    .where('id = :userId', { userId: changeUserRoleDTO.id })
                    .returning(['id', 'firstName', 'lastName', 'email'])
                    .execute();

                return Object.assign(result.raw[0]);
            } catch (error) {
                if (error.code.toString() === '22P02') {
                    throw new ConflictException(`Role named ${changeUserRoleDTO.role} cannot be assigned to user ${changeUserRoleDTO.id}`);
                } else {
                    throw new InternalServerErrorException('Error while saving user to database');
                }
            }
        } else {
            throw new NotFoundException('User not found');
        }
    }
}
