import { Controller, Post, Body, ValidationPipe, Param, UseGuards, Get, Patch, Delete, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { ReturnUserDTO } from './dto/returnUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { DeleteUserDTO } from './dto/deleteUser.dto';
import { FindUsersDTO } from './dto/findUsers.dto';
import { FilterUsersDTO } from './dto/filterUsers.dto';
import { createUserSchema } from './schema/createUser.schema';
import { changeUserRoleSchema } from './schema/changeUserRole.schema';
import { updateUserSchema } from './schema/updateUser.schema';
import { Role } from './../auth/decorators/role.decorator';
import { GetUser } from './decorators/getUser.decorator';
import { RolesGuard } from './../auth/role.guard';
import { UserRoleType } from './types/userRole.type';
import { User } from './entity/user.entity';


@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
    constructor(private usersService: UserService) {}

    @Post('/create')
    @Role(UserRoleType.ADMIN)
    @ApiOkResponse({
        type: ReturnUserDTO,
        description: 'The method for create users',
    })
    @ApiBody({ schema: createUserSchema })
    public async createUser(@Body(ValidationPipe) createUserDTO: CreateUserDTO): Promise<ReturnUserDTO> {
        const user = await this.usersService.createUser(createUserDTO);
        return {
            user,
            message: 'User registered successfully',
        };
    }

    @Patch('/update-role/:id')
    @Role(UserRoleType.ADMIN)
    @ApiOkResponse({
        type: ReturnUserDTO,
        description: 'The method for change role of user',
    })
    @ApiBody({ schema: changeUserRoleSchema })
    public async updateUserRole(@Param('id') id: string, @Body(ValidationPipe) updateUserDTO: UpdateUserDTO): Promise<ReturnUserDTO> {
        const user = await this.usersService.updateUserRole(id, updateUserDTO);
        return {
            user,
            message: 'User role changed successfully',
        };
    }

    @Patch('/update')
    @ApiOkResponse({
        type: ReturnUserDTO,
        description: 'The method for update data of user',
    })
    @ApiBody({ schema: updateUserSchema })
    public async updateUser(@Body(ValidationPipe) updateUserDTO: UpdateUserDTO, @GetUser() user: User): Promise<ReturnUserDTO> {
        const updatedUser = await this.usersService.updateUser(user.id, updateUserDTO);
        return {
            user: updatedUser,
            message: 'User updated successfully',
        };
    }

    @Delete('/delete/:id')
    @ApiOkResponse({
        type: DeleteUserDTO,
        description: 'The method for update data of user',
    })
    public async deleteUser(@Param('id') id: string): Promise<DeleteUserDTO> {
        await this.usersService.deleteUser(id);
        return { message: 'User deleted successfully' };
    }

    @Get('/profile')
    @ApiOkResponse({
        type: User,
        description: 'The method have to return a user',
    })
    public getMe(@GetUser() user: User): User {
        return user;
    }

    @Get('/search')
    @Role(UserRoleType.ADMIN)
    @ApiOkResponse({
        type: FindUsersDTO,
        description: 'The method for find users',
    })
    @ApiQuery({ name: 'firstName', required: false })
    @ApiQuery({ name: 'lastName', required: false })
    @ApiQuery({ name: 'email', required: false })
    @ApiQuery({ name: 'isActive', required: false })
    @ApiQuery({ name: 'role', enum: UserRoleType, required: false })
    @ApiQuery({ name: 'sort', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    public async findUsers(@Query() query: FindUsersDTO): Promise<FilterUsersDTO> {
        return await this.usersService.findUsers(query);
    }
}
