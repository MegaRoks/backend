import { Controller, Post, Body, Put, ValidationPipe, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { CreateUserDTO } from './dto/createUser.dto';
import { ReturnUserDTO } from './dto/returnUser.dto';
import { ChangeUserRoleDTO } from './dto/changeUserRole.dto';
import { createUser } from './schema/createUser.schema';
import { changeUserRole } from './schema/changeUserRole.schema';
import { Role } from '../auth/decorators/role.decorator';
import { UserRoleType } from './types/userRole.type';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private usersService: UserService) {}

    @Post('/create-user')
    @ApiOkResponse({
        type: ReturnUserDTO,
        description: 'The method for create users',
    })
    @ApiBody({ schema: createUser })
    public async createUser(@Body(ValidationPipe) createUserDTO: CreateUserDTO): Promise<ReturnUserDTO> {
        const user = await this.usersService.createUser(createUserDTO);
        return {
            user,
            message: 'User registered successfully',
        };
    }

    @Put('/change-user-role/:id')
    @Role(UserRoleType.ADMIN)
    @UseGuards(AuthGuard())
    @ApiOkResponse({
        type: ReturnUserDTO,
        description: 'The method for change role of user',
    })
    @ApiBody({ schema: changeUserRole })
    public async changeUserRole(@Param('id') id: string, @Body(ValidationPipe) changeUserRoleDTO: ChangeUserRoleDTO): Promise<ReturnUserDTO> {
        const user = await this.usersService.changeUserRole(id, changeUserRoleDTO);
        return {
            user,
            message: 'User role changed successfully',
        };
    }
}
