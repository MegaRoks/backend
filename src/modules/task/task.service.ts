import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { CreateTaskDTO } from './dto/createTask.dto';
import { DeleteTaskDTO } from './dto/deleteTask.dto';
import { GetListTasksDTO } from './dto/getListTask.dto';
import { UpdateTaskDTO } from './dto/updateTask.dto';
import { Task } from './entity/task.entity';

import { TaskRepository } from './repository/task.repository';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskRepository)
        private readonly taskRepository: TaskRepository,
    ) {}

    public async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
        return await this.taskRepository.createTask(createTaskDTO);
    }

    public async updateTask(updateTaskDTO: UpdateTaskDTO): Promise<Task> {
        try {
            const task = await this.taskRepository.getTaskByTaskIdAndTotoId(updateTaskDTO.id, updateTaskDTO.todoId);

            return await this.taskRepository.updateTask(task.todoId, updateTaskDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async deleteTask(deleteTaskDTO: DeleteTaskDTO): Promise<void> {
        try {
            const task = await this.taskRepository.getTaskByTaskIdAndTotoId(deleteTaskDTO.id, deleteTaskDTO.todoId);

            await this.taskRepository.deleteTask(task.id, task.todoId);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async getListOfTaskTasks(getListTaskOfUserDTO: GetListTasksDTO): Promise<{ tasks: Task[]; total: number }> {
        try {
            return await this.taskRepository.getListOfTaskTasks(getListTaskOfUserDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }
}
