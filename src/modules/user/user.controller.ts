import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ReturnUserDto } from './dto/returnUser.dto';
import { createUser } from './schema/createUser.schema';
import { UserRole } from './types/userRole.type';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private usersService: UserService) {}

    @Post('/create-admin')
    @ApiOkResponse({
        type: ReturnUserDto,
        description: 'The method for create admins',
    })
    @ApiBody({ schema: createUser })
    public async createAdmin(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
        const user = await this.usersService.createUser(createUserDto, UserRole.admin);
        return {
            user,
            message: 'Administrator registered successfully',
        };
    }

    @Post('/create-user')
    @ApiOkResponse({
        type: ReturnUserDto,
        description: 'The method for create users',
    })
    @ApiBody({ schema: createUser })
    public async createUser(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
        const user = await this.usersService.createUser(createUserDto, UserRole.user);
        return {
            user,
            message: 'User registered successfully',
        };
    }
}
