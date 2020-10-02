import { WsException } from '@nestjs/websockets';
import { EntityRepository, Repository } from 'typeorm';

import { GetTodosListDTO } from './../dto/getTodosList.dto';
import { UpdateTodoDTO } from './../dto/updateTodo.dto';
import { CreateTodoDTO } from './../dto/createTodo.dto';
import { DeleteTodoDTO } from './../dto/deleteTodo.dto';
import { FilerTodosDTO } from '../dto/filterTodos.dto';
import { Todo } from './../entity/todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
    public async createTodo(createTodoDTO: CreateTodoDTO): Promise<Todo> {
        const todo = this.create(createTodoDTO);
        await this.createQueryBuilder()
            .insert()
            .into(Todo)
            .values(todo)
            .execute()
            .then((todo) => todo)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        return todo;
    }

    public async updateTodo(updateTodoDTO: UpdateTodoDTO): Promise<Todo> {
        const todo = this.create(updateTodoDTO);
        await this.createQueryBuilder()
            .update(Todo)
            .set(todo)
            .where('id = :todoId', { todoId: todo.id })
            .andWhere('userId = :userId', { userId: todo.userId })
            .execute()
            .then((todo) => todo)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        return todo;
    }

    public async deleteTodo(deleteTodoDTO: DeleteTodoDTO): Promise<void> {
        const todo = this.create(deleteTodoDTO);
        await this.createQueryBuilder()
            .delete()
            .from(Todo)
            .where('id = :todoId', { todoId: todo.id })
            .andWhere('userId = :userId', { userId: todo.userId })
            .execute()
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });
    }

    public async getTodosList(getListTodosDTO: GetTodosListDTO): Promise<FilerTodosDTO> {
        const { userId, sort, page, limit } = getListTodosDTO;
        const query = this.createQueryBuilder();

        query.select(['t']);
        query.from(Todo, 't');
        query.leftJoinAndSelect('t.tasks', 'task');
        query.where('t.userId = :userId', { userId });

        page > 0 && limit > 0 && query.skip((page - 1) * limit);
        page > 0 && limit < 0 && query.skip((page - 1) * 100);
        page < 0 && limit < 0 && query.skip((1 - 1) * 100);

        // todo added logic for sort parameters
        sort && query.orderBy(JSON.parse(sort));

        limit ? query.take(+limit) : query.take(100);

        const [todos, total] = await query
            .getManyAndCount()
            .then((todo) => todo)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        return { todos, total };
    }

    public async getTodo(todoId: string, userId: string): Promise<Todo | undefined> {
        return await this.createQueryBuilder()
            .select(['t'])
            .from(Todo, 't')
            .leftJoinAndSelect('t.tasks', 'task')
            .where('t.id = :todoId', { todoId })
            .andWhere('t.userId = :userId', { userId })
            .getOne()
            .then((todo) => todo)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });
    }
}
