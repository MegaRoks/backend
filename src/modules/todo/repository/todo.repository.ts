import { ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';

import { Todo } from './../entity/todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
    public async createTodo(data: any): Promise<any> {
        return { data };
    }

    public async updateTodo(data: any): Promise<any> {
        return { data };
    }

    public async deleteTodo(data: any): Promise<any> {
        return { data };
    }

    public async getListOfUserTodos(data: any): Promise<any> {
        return { data };
    }
}
