import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUserId = createParamDecorator((_: unknown, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();
    const user = client.user;
    
    return user.id;
});
