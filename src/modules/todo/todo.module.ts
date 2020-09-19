import { Module } from '@nestjs/common';

import { TodoGateway } from './todo.gateway';
import { TodoService } from './todo.service';

@Module({
    imports: [],
    providers: [TodoGateway, TodoService],
})
export class TodoModule {}
