import { WsException } from '@nestjs/websockets';
import { EntityRepository, Repository } from 'typeorm';

import { GetListTodosDTO } from './../dto/getListTodos.dto';
import { UpdateTodoDTO } from './../dto/updateTodo.dto';
import { CreateTodoDTO } from './../dto/createTodo.dto';
import { Todo } from './../entity/todo.entity';

@EntityRepository(Todo)
export class TodoRepository extends Repository<Todo> {
    public async createTodo(userId: string, createTodoDTO: CreateTodoDTO): Promise<Todo> {
        const todo = this.create({ userId, ...createTodoDTO });
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

    public async updateTodo(userId: string, updateTodoDTO: UpdateTodoDTO): Promise<Todo> {
        const todo = this.create(updateTodoDTO);
        await this.createQueryBuilder()
            .update(Todo)
            .set(todo)
            .where('id = :todoId', { todoId: todo.id })
            .andWhere('userId = :userId', { userId })
            .execute()
            .then((todo) => todo)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        return todo;
    }

    public async deleteTodo(userId: string, todoId: string): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .from(Todo)
            .where('id = :todoId', { todoId })
            .andWhere('userId = :userId', { userId })
            .execute()
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });
    }

    public async getListOfUserTodos(getListTodosDTO: GetListTodosDTO): Promise<{ todos: Todo[]; total: number }> {
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

    public async getTodoByTodoIdAndUserId(userId: string, todoId: string): Promise<Todo> {
        const todo = await this.createQueryBuilder()
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

        if (!todo) {
            throw new WsException('Todo not found');
        }

        return todo;
    }
}
