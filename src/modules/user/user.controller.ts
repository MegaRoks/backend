import { Controller, Post, Body, ValidationPipe, Param, UseGuards, Get, Patch } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { ReturnUserDTO } from './dto/returnUser.dto';
import { UpdateUserDTO } from './dto/updateUser.dto';
import { createUserSchema } from './schema/createUser.schema';
import { changeUserRoleSchema } from './schema/changeUserRole.schema';
import { updateUserSchema } from './schema/updateUser.schema';
import { Role } from './../auth/decorators/role.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { RolesGuard } from './../auth/role.guard';
import { UserRoleType } from './types/userRole.type';
import { User } from './entity/user.entity';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
@UseGuards(AuthGuard(), RolesGuard)
export class UserController {
    constructor(private usersService: UserService) {}

    @Post('/create-user')
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

    @Patch('/update-user-role/:id')
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

    @Patch('/update-user')
    @ApiOkResponse({
        type: User,
        description: 'The method for update data of user',
    })
    @ApiBody({ schema: updateUserSchema })
    public async updateUser(@Body(ValidationPipe) updateUserDTO: UpdateUserDTO, @GetUser() user: User): Promise<User> {
        return this.usersService.updateUser(user.id, updateUserDTO);
    }

    @Get('/profile')
    @ApiOkResponse({
        type: User,
        description: 'The method have to return a user',
    })
    public getMe(@GetUser() user: User): User {
        return user;
    }
}
