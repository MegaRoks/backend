import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from './../entity/user.entity';
import { CreateUserDTO } from './../dto/createUser.dto';
import { UpdateUserDTO } from './../dto/updateUser.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public async createUser(createUserDTO: CreateUserDTO): Promise<User> {
        const user = this.create(createUserDTO);

        try {
            await this.createQueryBuilder()
                .insert()
                .into(User)
                .values(user)
                .execute();

            return user;
        } catch (error) {
            if (error.code.toString() === '23505') {
                throw new ConflictException('Email address already in use');
            } else {
                throw new InternalServerErrorException('Error while saving user to database');
            }
        }
    }

    public async updateUser(userId: string, updateUserDTO: UpdateUserDTO): Promise<void> {
        const user = this.create(updateUserDTO);
        
        try {
            await this.createQueryBuilder().update(User).set(user).where('id = :userId', { userId }).execute();
         } catch (error) {
            throw new InternalServerErrorException('Error while saving user to database');
        }
    }

    public async deleteUser(userId: string): Promise<void> {
        try {
            await this.createQueryBuilder()
                .delete().from(User, 'u')
                .where('u.id = :userId', { userId })
                .execute();
        } catch (error) {
            throw new InternalServerErrorException('Error while saving user to database');
        }
    }

    public async getUserById(userId: string): Promise<User> {
        try {
            const user = await this.createQueryBuilder()
                .select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.isActive', 'u.role'])
                .from(User, 'u')
                .where('u.id = :userId', { userId })
                .andWhere('u.isActive = :isActive', { isActive: true })
                .getOne();

            if (!user) {
                throw new NotFoundException('User not found');
            }

            return user;
        } catch (error) {
            throw new InternalServerErrorException('Error while saving user to database');
        }
    }

    public async getUserByEmail(userEmail: string): Promise<User> {        
        try {
            const user = await this.createQueryBuilder()
                .select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.isActive', 'u.role'])
                .from(User, 'u')
                .where('u.email = :userEmail', { userEmail })
                .andWhere('u.isActive = :isActive', { isActive: true })
                .getOne();

            if (!user) {
                throw new NotFoundException('User not found');
            }

            return user;
        } catch (error) {
            throw new InternalServerErrorException('Error while saving user to database');
        }
    }
}
