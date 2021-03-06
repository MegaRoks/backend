import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from './../entity/user.entity';
import { CreateUserDTO } from './../dto/createUser.dto';
import { UpdateUserDTO } from './../dto/updateUser.dto';
import { FindUsersDTO } from './../dto/findUsers.dto';
import { FilterUsersDTO } from './../dto/filterUsers.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public async createUser(createUserDTO: CreateUserDTO): Promise<User> {
        const user = this.create(createUserDTO);
        await this.createQueryBuilder()
            .insert()
            .into(User)
            .values(user)
            .execute()
            .catch((error) => {
                if (error.code.toString() === '23505') {
                    throw new ConflictException('Email address already in use');
                } else {
                    throw new InternalServerErrorException('Error while saving user to database');
                }
            });

        delete user.password;
        delete user.salt;

        return user;
    }

    public async updateUser(userId: string, updateUserDTO: UpdateUserDTO): Promise<User> {
        const user = this.create(updateUserDTO);
        await this.createQueryBuilder()
            .update(User)
            .set(user)
            .where('id = :userId', { userId })
            .execute()
            .catch(() => {
                throw new InternalServerErrorException('Error while saving user to database');
            });

        return user;
    }

    public async deleteUser(userId: string): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .from(User)
            .where('id = :userId', { userId })
            .execute()
            .catch(() => {
                throw new InternalServerErrorException('Error while saving user to database');
            });
    }

    public async getUserById(userId: string): Promise<User> {
        const user = await this.createQueryBuilder()
            .select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.isActive', 'u.role'])
            .from(User, 'u')
            .where('u.id = :userId', { userId })
            .andWhere('u.isActive = :isActive', { isActive: true })
            .getOne()
            .then((user) => user)
            .catch(() => {
                throw new InternalServerErrorException('Error while saving user to database');
            });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    public async getUserByConfirmationToken(confirmationToken: string): Promise<User> {
        const user = await this.createQueryBuilder()
            .select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.isActive', 'u.role'])
            .from(User, 'u')
            .where('u.confirmationToken = :confirmationToken', { confirmationToken })
            .getOne()
            .then((user) => user)
            .catch(() => {
                throw new InternalServerErrorException('Error while saving user to database');
            });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    public async getUserByRecoverToken(recoverToken: string): Promise<User> {
        const user = await this.createQueryBuilder()
            .select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.isActive', 'u.role'])
            .from(User, 'u')
            .where('u.recoverToken = :recoverToken', { recoverToken })
            .getOne()
            .then((user) => user)
            .catch(() => {
                throw new InternalServerErrorException('Error while saving user to database');
            });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    public async getUserByEmail(userEmail: string): Promise<User> {
        const user = await this.createQueryBuilder()
            .select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.isActive', 'u.role'])
            .from(User, 'u')
            .where('u.email = :userEmail', { userEmail })
            .andWhere('u.isActive = :isActive', { isActive: true })
            .getOne()
            .then((user) => user)
            .catch(() => {
                throw new InternalServerErrorException('Error while saving user to database');
            });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    public async findUsers(queryDTO: FindUsersDTO): Promise<FilterUsersDTO> {
        const { firstName, lastName, email, isActive, role, sort, page, limit } = queryDTO;
        const query = this.createQueryBuilder();

        query.select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.role', 'u.isActive']);
        query.from(User, 'u');

        isActive ? query.where('u.isActive = :isActive', { isActive }) : query.where('u.isActive = :isActive', { isActive: true });

        email && query.andWhere('u.email ILIKE :email', { email: `%${email}%` });
        firstName && query.andWhere('u.firstName ILIKE :firstName', { firstName: `%${firstName}%` });
        lastName && query.andWhere('u.lastName ILIKE :lastName', { lastName: `%${lastName}%` });
        role && query.andWhere('u.role = :role', { role });

        page > 0 && limit > 0 && query.skip((page - 1) * limit);
        page > 0 && limit < 0 && query.skip((page - 1) * 100);
        page < 0 && limit < 0 && query.skip((1 - 1) * 100);

        // todo added logic for sort parameters
        sort && query.orderBy(JSON.parse(sort));

        limit ? query.take(+limit) : query.take(100);

        const [users, total] = await query.getManyAndCount();

        return { users, total };
    }

    public async getUserByEmailWithCredentials(email: string): Promise<User> {
        const user = this.createQueryBuilder()
            .select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.isActive', 'u.role', 'u.salt', 'u.password'])
            .from(User, 'u')
            .where('u.email = :email', { email })
            .andWhere('u.isActive = :isActive', { isActive: true })
            .getOne()
            .then((user) => user)
            .catch(() => {
                throw new InternalServerErrorException('Error while saving user to database');
            });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
