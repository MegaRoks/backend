import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const MessageData = createParamDecorator((_: unknown, context: ExecutionContext) => {
    const client = context.switchToWs().getClient();
    const user = client.user;
    const data = context.switchToWs().getData();

    return { ...data, userId: user.id };
});
