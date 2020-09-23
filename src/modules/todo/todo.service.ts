import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';

import { CreateTodoDTO } from './dto/createTodo.dto';
import { DeleteTodoDTO } from './dto/deleteTodo.dto';
import { GetTodosListDTO } from './dto/getTodosList.dto';
import { UpdateTodoDTO } from './dto/updateTodo.dto';
import { Todo } from './entity/todo.entity';
import { TodoRepository } from './repository/todo.repository';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoRepository)
        private readonly todoRepository: TodoRepository,
    ) {}

    public async createTodo(createTodoDTO: CreateTodoDTO): Promise<Todo> {
        return await this.todoRepository.createTodo(createTodoDTO);
    }

    public async updateTodo(updateTodoDTO: UpdateTodoDTO): Promise<Todo> {
        try {
            const todo = await this.todoRepository.getTodo(updateTodoDTO.id, updateTodoDTO.userId);

            if (!todo) {
                throw new WsException('Todo not found');
            }

            return await this.todoRepository.updateTodo(updateTodoDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async deleteTodo(deleteTodoDTO: DeleteTodoDTO): Promise<void> {
        try {
            const todo = await this.todoRepository.getTodo(deleteTodoDTO.id, deleteTodoDTO.userId);

            if (!todo) {
                throw new WsException('Todo not found');
            }

            await this.todoRepository.deleteTodo(deleteTodoDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async getTodosList(getListTodosDTO: GetTodosListDTO): Promise<{ todos: Todo[]; total: number }> {
        try {
            return await this.todoRepository.getTodosList(getListTodosDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }
}
