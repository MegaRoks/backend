import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';

import { TaskRepository } from './repository/task.repository';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository)
        private readonly taskRepository: TaskRepository,
    ) {}

    public async createTask(createTaskDTO: any): Promise<any> {
        return await this.taskRepository.createTask(createTaskDTO);
    }

    public async updateTask(updateTaskDTO: any): Promise<any> {
        try {
            const task = await this.taskRepository.getTaskByTaskId();

            return await this.taskRepository.updateTask(updateTaskDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async deleteTask(deleteTaskDTO: any): Promise<any> {
        try {
            const task = await this.taskRepository.getTaskByTaskId();

            await this.taskRepository.deleteTask(deleteTaskDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async getListOfTaskTasks(getListTaskOfUserDTO: any): Promise<{ tasks: any[]; total: number }> {
        try {
            return await this.taskRepository.getListOfTaskTasks(getListTaskOfUserDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }
}
