import { WsException } from '@nestjs/websockets';
import { EntityRepository, Repository } from 'typeorm';

import { CreateTodoDTO } from './../dto/createTodo.dto';

import { Todo } from './../entity/todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
    public async createTodo(createTodoDTO: CreateTodoDTO): Promise<any> {
        // createTodoDTO.userId = 'b0211665-02a3-44f1-8a05-bfc01a6550cb';
    
        // const todo = this.create(createTodoDTO);
        // await this.createQueryBuilder()
        //     .insert()
        //     .into(Todo)
        //     .values(todo)
        //     .execute()
        //     .catch(() => {
        //         throw new WsException('Error while saving user to database');
        //     });
        return createTodoDTO;
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
