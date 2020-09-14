import { Module } from '@nestjs/common';

import { TodoGateway } from './todo.gateway';

@Module({
    imports: [],
    providers: [TodoGateway],
})
export class TodoModule {}
