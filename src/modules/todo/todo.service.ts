import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';

import { CreateTodoDTO } from './dto/createTodo.dto';
import { DeleteTodoDTO } from './dto/deleteTodo.dto';
import { GetListTodoOfUserDTO } from './dto/getListTodoOfUser.dto';
import { UpdateTodoDTO } from './dto/updateTodo.dto';
import { Todo } from './entity/todo.entity';
import { TodoRepository } from './repository/todo.repository';

@Injectable()
export class TodoService {
    constructor(
        @InjectRepository(TodoRepository)
        private readonly todoRepository: TodoRepository,
    ) {}

    public async createTodo(userId: string, createTodoDTO: CreateTodoDTO): Promise<Todo> {
        return await this.todoRepository.createTodo(userId, createTodoDTO);
    }

    public async updateTodo(userId: string, updateTodoDTO: UpdateTodoDTO): Promise<Todo> {
        try {
            const todo = await this.todoRepository.getTodoByTodoIdAndUserId(userId, updateTodoDTO.id);

            return await this.todoRepository.updateTodo(todo.userId, updateTodoDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async deleteTodo(userId: string, deleteTodoDTO: DeleteTodoDTO): Promise<void> {
        try {
            const todo = await this.todoRepository.getTodoByTodoIdAndUserId(userId, deleteTodoDTO.id);

            await this.todoRepository.deleteTodo(userId, todo.id);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async getListOfUserTodos(getListTodoOfUserDTO: GetListTodoOfUserDTO): Promise<{ todos: Todo[]; total: number }> {
        try {
            return await this.todoRepository.getListOfUserTodos(getListTodoOfUserDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }
}
