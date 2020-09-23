import { EntityRepository, Repository } from 'typeorm';

import { Task } from './../entity/task.entity';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    public async createTask(createTaskDTO: any): Promise<any> {
        return createTaskDTO;
    }

    public async updateTask(updateTaskDTO: any): Promise<any> {
        return updateTaskDTO;
    }

    public async deleteTask(deleteTaskDTO: any): Promise<any> {
        return { deleteTaskDTO };
    }

    public async getTaskByTaskId(): Promise<any> {
        return {};
    }

    public async getListOfTaskTasks(getListTaskOfUserDTO: any): Promise<{ tasks: any[]; total: number }> {
        return { tasks: [getListTaskOfUserDTO], total: 0 };
    }
}
