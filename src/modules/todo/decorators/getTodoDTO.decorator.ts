import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetTodoDTO = createParamDecorator((_: unknown, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();
    const user = client.user;
    const data = context.switchToWs().getData();
    
    return { 
        title: data.title,
        userId: user.id
    };
});
