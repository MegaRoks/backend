import { ConflictException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { User } from './../entity/user.entity';
import { CreateUserDTO } from './../dto/createUser.dto';
import { ChangeUserRoleDTO } from './../dto/changeUserRole.dto';
import { CredentialsDto } from 'src/modules/auth/dto/credentials.dto';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    public async createUser(createUserDTO: CreateUserDTO): Promise<User> {
        const user = this.create(createUserDTO);

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

    public async checkCredentials(credentialsDto: CredentialsDto): Promise<User> {
        const { email, password } = credentialsDto;

        const user = await this.createQueryBuilder()
            .select(['u.id', 'u.email', 'u.password', 'u.salt'])
            .from(User, 'u')
            .where('u.email = :email', { email })
            .andWhere('u.isActive = :isActive', { isActive: true })
            .getOne();

        console.log(user);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const isCheckPassword = await user.checkPassword(password);
        if (user && isCheckPassword) {
            return await this.getUserById(user.id);
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }

    public async changeUserRole(userId: string, changeUserRoleDTO: ChangeUserRoleDTO): Promise<User> {
        const user = await this.getUserById(userId);

        if (user) {
            try {
                const result = await this.createQueryBuilder()
                    .update(User)
                    .set({ role: changeUserRoleDTO.role })
                    .where('id = :userId', { userId })
                    .returning(['id', 'firstName', 'lastName', 'email'])
                    .execute();

                return Object.assign(result.raw[0]);
            } catch (error) {
                if (error.code.toString() === '22P02') {
                    throw new ConflictException(`Role named ${changeUserRoleDTO.role} cannot be assigned to user ${userId}`);
                } else {
                    throw new InternalServerErrorException('Error while saving user to database');
                }
            }
        } else {
            throw new NotFoundException('User not found');
        }
    }

    private async getUserById(userId: string) {
        return await this.createQueryBuilder()
            .select(['u.id', 'u.firstName', 'u.lastName', 'u.email', 'u.role'])
            .from(User, 'u')
            .where('u.id = :userId', { userId })
            .getOne();
    }
}
