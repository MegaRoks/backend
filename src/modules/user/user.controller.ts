import { Controller, Post, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags, ApiBody } from '@nestjs/swagger';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUser.dto';
import { ReturnUserDto } from './dto/returnUser.dto';
import { createUser } from './schema/createUser.schema';

@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
    constructor(private usersService: UserService) {}

    @Post()
    @ApiOkResponse({
        type: ReturnUserDto,
        description: 'The method for create admins',
    })
    @ApiBody({ schema: createUser })
    public async createAdminUser(@Body() createUserDto: CreateUserDto): Promise<ReturnUserDto> {
        const user = await this.usersService.createAdminUser(createUserDto);
        return {
            user,
            message: 'Administrator registered successfully',
        };
    }
}
