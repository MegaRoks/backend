import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TodoGateway } from './todo.gateway';
import { TodoService } from './todo.service';
import { TodoRepository } from './repository/todo.repository';

@Module({
    imports: [TypeOrmModule.forFeature([TodoRepository])],
    providers: [TodoGateway, TodoService],
})
export class TodoModule {}
