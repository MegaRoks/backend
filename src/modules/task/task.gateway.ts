import { UseGuards } from '@nestjs/common';
import { ConnectedSocket, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { TokenGuard } from './../token/guards/token.guard';
import { MessageData } from './../shared/decorators/messageData.decorator';
import { CreateTaskDTO } from './dto/createTask.dto';
import { DeleteTaskDTO } from './dto/deleteTask.dto';
import { GetTasksListDTO } from './dto/getTasksList.dto';
import { UpdateTaskDTO } from './dto/updateTask.dto';
import { FilterTasksDTO } from './dto/filterTasks.dto';
import { Task } from './entity/task.entity';
import { TaskService } from './task.service';

@UseGuards(TokenGuard)
@WebSocketGateway()
export class TaskGateway {
    constructor(private readonly taskService: TaskService) {}

    public handleDisconnect(@ConnectedSocket() client: Socket) {
        console.log('Disconnected', client.id);
    }

    public handleConnection(@ConnectedSocket() client: Socket) {
        console.log('Connected', client.id);
    }

    @SubscribeMessage('createTask')
    public async handleCreateTask(@MessageData() createTaskDTO: CreateTaskDTO): Promise<WsResponse<Task>> {
        const task = await this.taskService.createTask(createTaskDTO);
        return { event: 'createdTask', data: task };
    }

    @SubscribeMessage('updateTask')
    public async handleUpdateTask(@MessageData() updateTaskDTO: UpdateTaskDTO): Promise<WsResponse<Task>> {
        const task = await this.taskService.updateTask(updateTaskDTO);
        return { event: 'updatedTask', data: task };
    }

    @SubscribeMessage('deleteTask')
    public async handleDeleteTask(@MessageData() deleteTaskDTO: DeleteTaskDTO): Promise<WsResponse<Task>> {
        const task = await this.taskService.deleteTask(deleteTaskDTO);
        return { event: 'deletedTask', data: task };
    }

    @SubscribeMessage('getTasksList')
    public async handleGetTasksList(@MessageData() getListTasksDTO: GetTasksListDTO): Promise<WsResponse<FilterTasksDTO>> {
        const tasks = await this.taskService.getTasksList(getListTasksDTO);
        return { event: 'gotTasksList', data: tasks };
    }
}
