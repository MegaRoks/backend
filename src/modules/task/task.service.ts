import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WsException } from '@nestjs/websockets';
import { CreateTaskDTO } from './dto/createTask.dto';
import { DeleteTaskDTO } from './dto/deleteTask.dto';
import { FilterTasksDTO } from './dto/filterTasks.dto';
import { GetTasksListDTO } from './dto/getTasksList.dto';
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
            const task = await this.taskRepository.getTaskBy(updateTaskDTO.id, updateTaskDTO.todoId, updateTaskDTO.userId);

            if (!task) {
                throw new WsException('Todo not found');
            }

            return await this.taskRepository.updateTask(updateTaskDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async deleteTask(deleteTaskDTO: DeleteTaskDTO): Promise<void> {
        try {
            const task = await this.taskRepository.getTaskBy(deleteTaskDTO.id, deleteTaskDTO.todoId, deleteTaskDTO.userId);

            if (!task) {
                throw new WsException('Todo not found');
            }

            await this.taskRepository.deleteTask(deleteTaskDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }

    public async getTasksList(getListTaskOfUserDTO: GetTasksListDTO): Promise<FilterTasksDTO> {
        try {
            return await this.taskRepository.getTasksList(getListTaskOfUserDTO);
        } catch (err) {
            throw new WsException(err.message);
        }
    }
}
