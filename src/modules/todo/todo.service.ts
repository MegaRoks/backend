import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException, WsResponse } from '@nestjs/websockets';

import { CreateTodoDTO } from './dto/createTodo.dto';
import { TodoRepository } from './repository/todo.repository';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoRepository)
        private readonly todoRepository: TodoRepository,
    ) {}

    public async createTodo(createTodoDTO: CreateTodoDTO): Promise<WsResponse<any>> {
        const todo = await  this.todoRepository.createTodo(createTodoDTO);
        return { event: 'createdTodo', data: todo };
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
