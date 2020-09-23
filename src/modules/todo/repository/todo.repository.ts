import { WsException } from '@nestjs/websockets';
import { EntityRepository, Repository } from 'typeorm';

import { GetListTodoOfUserDTO } from '../dto/getListTodoOfUser.dto';
import { UpdateTodoDTO } from '../dto/updateTodo.dto';
import { CreateTodoDTO } from './../dto/createTodo.dto';
import { Todo } from './../entity/todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
    public async createTodo(createTodoDTO: CreateTodoDTO): Promise<any> {
        const todo = this.create(createTodoDTO);
        await this.createQueryBuilder()
            .insert()
            .into(Todo)
            .values(todo)
            .execute()
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        return todo;
    }

    public async updateTodo(updateTodoDTO: UpdateTodoDTO): Promise<void> {
        const todo = this.create(updateTodoDTO);
        await this.createQueryBuilder()
            .update(Todo)
            .set(todo)
            .where('id = :todoId', { todoId: todo.id })
            .execute()
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });
    }

    public async deleteTodo(todoId: string): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .from(Todo)
            .where('id = :todoId', { todoId })
            .execute()
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });
    }

    public async getListOfUserTodos(getListTodoOfUserDTO: GetListTodoOfUserDTO): Promise<{ todos: Todo[]; total: number }> {
        const { userId, sort, page, limit } = getListTodoOfUserDTO;
        const query = this.createQueryBuilder();

        query.select(['t.id', 't.title', 't.userId']);
        query.from(Todo, 't');
        query.where('t.userId = :userId', { userId });

        page > 0 && limit > 0 && query.skip((page - 1) * limit);
        page > 0 && limit < 0 && query.skip((page - 1) * 100);
        page < 0 && limit < 0 && query.skip((1 - 1) * 100);

        // todo added logic for sort parameters
        sort && query.orderBy(JSON.parse(sort));

        limit ? query.take(+limit) : query.take(100);

        const [todos, total] = await query.getManyAndCount();

        return { todos, total };
    }

    public async getTodoById(todoId: string): Promise<Todo> {
        const todo = await this.createQueryBuilder()
            .select(['t.id', 't.title', 't.userId'])
            .from(Todo, 't')
            .where('id = :todoId', { todoId })
            .getOne()
            .then((todo) => todo)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        if (!todo) {
            throw new WsException('Todo not found');
        }

        return todo;
    }
}
