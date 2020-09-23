import { WsException } from '@nestjs/websockets';
import { EntityRepository, Repository } from 'typeorm';

import { CreateTaskDTO } from './../dto/createTask.dto';
import { GetListTasksDTO } from './../dto/getListTask.dto';
import { UpdateTaskDTO } from './../dto/updateTask.dto';
import { Task } from './../entity/task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    public async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
        const task = this.create(createTaskDTO);
        await this.createQueryBuilder()
            .insert()
            .into(Task)
            .values(task)
            .execute()
            .then((task) => task)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        return task;
    }

    public async updateTask(todoId: string, updateTaskDTO: UpdateTaskDTO): Promise<any> {
        const task = this.create(updateTaskDTO);
        await this.createQueryBuilder()
            .update(Task)
            .set(task)
            .where('id = :taskId', { taskId: task.id })
            .andWhere('todoId = :todoId', { todoId })
            .execute()
            .then((task) => task)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        return task;
    }

    public async deleteTask(taskId: string, todoId: string): Promise<void> {
        await this.createQueryBuilder()
            .delete()
            .from(Task)
            .where('id = :taskId', { taskId })
            .andWhere('todoId = :todoId', { todoId })
            .execute()
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });
    }

    public async getTaskByTaskIdAndTotoId(taskId: string, todoId: string): Promise<Task> {
        const task = await this.createQueryBuilder()
            .select(['t.id', 't.title', 't.todoId'])
            .from(Task, 't')
            .where('t.id = :taskId', { taskId })
            .andWhere('t.todoId = :todoId', { todoId })
            .getOne()
            .then((todo) => todo)
            .catch(() => {
                throw new WsException('Error while saving user to database');
            });

        if (!task) {
            throw new WsException('Todo not found');
        }

        return task;
    }

    public async getListOfTaskTasks(getListTasksDTO: GetListTasksDTO): Promise<{ tasks: any[]; total: number }> {
        const { todoId, sort, page, limit } = getListTasksDTO;
        const query = this.createQueryBuilder();

        query.select(['t.id', 't.title', 't.todoId', 't.status']);
        query.from(Task, 't');
        query.where('t.todoId = :todoId', { todoId });

        page > 0 && limit > 0 && query.skip((page - 1) * limit);
        page > 0 && limit < 0 && query.skip((page - 1) * 100);
        page < 0 && limit < 0 && query.skip((1 - 1) * 100);

        // todo added logic for sort parameters
        sort && query.orderBy(JSON.parse(sort));

        limit ? query.take(+limit) : query.take(100);

        const [tasks, total] = await query.getManyAndCount();

        return { tasks, total };
    }
}
