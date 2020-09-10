import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('app')
@ApiBearerAuth()
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    @ApiOkResponse({
        description: 'Hello World!!!',
    })
    public getHello(): string {
        return this.appService.getHello();
    }
}
