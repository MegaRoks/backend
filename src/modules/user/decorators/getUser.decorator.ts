import { createParamDecorator } from '@nestjs/common';

import { User } from './../entity/user.entity';

export const GetUser = createParamDecorator((data, req): User => req.args[0].user);
