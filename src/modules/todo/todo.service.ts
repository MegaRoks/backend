import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException, WsResponse } from '@nestjs/websockets';

import { TodoRepository } from './repository/todo.repository';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoRepository)
        private readonly todoRepository: TodoRepository,
    ) {}

    public async createTodo(data: any): Promise<WsResponse<any>> {
        try {
            const todo = this.todoRepository.createTodo(data);

            return { event: 'createdTodo', data: todo };
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async updateTodo(data: any): Promise<WsResponse<any>> {
        try {
            const todo = this.todoRepository.updateTodo(data);

            return { event: 'updatedTodo', data: todo };
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async deleteTodo(data: any): Promise<WsResponse<any>> {
        try {
            const todo = this.todoRepository.deleteTodo(data);

            return { event: 'updatedTodo', data: todo };
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async getListOfUserTodos(data: any): Promise<WsResponse<any>> {
        try {
            const todo = this.todoRepository.getListOfUserTodos(data);

            return { event: 'updatedTodo', data: todo };
        } catch (err) {
            throw new WsException(err.message);
        }
    }
}
