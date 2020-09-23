import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { CreateTaskDTO } from './dto/createTask.dto';
import { DeleteTaskDTO } from './dto/deleteTask.dto';
import { GetListTasksDTO } from './dto/getListTask.dto';
import { UpdateTaskDTO } from './dto/updateTask.dto';
import { Task } from './entity/task.entity';
import { TaskService } from './task.service';

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
    public async handleCreateTask(@MessageBody() createTaskDTO: CreateTaskDTO): Promise<WsResponse<Task>> {
        const task = await this.taskService.createTask(createTaskDTO);

        return { event: 'createdTask', data: task };
    }

    @SubscribeMessage('updateTask')
    public async handleUpdateTask(@MessageBody() updateTaskDTO: UpdateTaskDTO): Promise<WsResponse<Task>> {
        const task = await this.taskService.updateTask(updateTaskDTO);

        return { event: 'updatedTask', data: task };
    }

    @SubscribeMessage('deleteTask')
    public async handleDeleteTask(@MessageBody() deleteTaskDTO: DeleteTaskDTO): Promise<WsResponse<{ message: string }>> {
        await this.taskService.deleteTask(deleteTaskDTO);

        return { event: 'deletedTask', data: { message: 'Task deleted successfully' } };
    }

    @SubscribeMessage('getListOfTaskTasks')
    public async handleGetListOfTaskTasks(@MessageBody() getListTasksDTO: GetListTasksDTO): Promise<WsResponse<{ tasks: Task[]; total: number }>> {
        const tasks = await this.taskService.getListOfTaskTasks(getListTasksDTO);

        return { event: 'gotListOfTaskTasks', data: tasks };
    }
}
