import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TodoGateway } from './todo.gateway';
import { TodoService } from './todo.service';
import { TodoRepository } from './repository/todo.repository';
import { UserRepository } from './../user/repository/user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([TodoRepository]),
        TypeOrmModule.forFeature([UserRepository]),
    ],
    providers: [TodoGateway, TodoService],
    exports: [TodoService],
})
export class TodoModule {}
