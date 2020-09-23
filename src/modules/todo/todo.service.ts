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

    public async createTodo(createTodoDTO: CreateTodoDTO): Promise<Todo> {
        return await this.todoRepository.createTodo(createTodoDTO);
    }

    public async updateTodo(updateTodoDTO: UpdateTodoDTO): Promise<Todo> {
        try {
            const todo = await this.todoRepository.getTodoById(updateTodoDTO.id);

            await this.todoRepository.updateTodo(updateTodoDTO);

            return todo;
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async deleteTodo(deleteTodoDTO: DeleteTodoDTO): Promise<void> {
        try {
            const todo = await this.todoRepository.getTodoById(deleteTodoDTO.id);

            await this.todoRepository.deleteTodo(todo.id);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async getListOfUserTodos(getListTodoOfUserDTO: GetListTodoOfUserDTO): Promise<{ todos: Todo[], total: number }> {
        try {
            return await this.todoRepository.getListOfUserTodos(getListTodoOfUserDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }
}
