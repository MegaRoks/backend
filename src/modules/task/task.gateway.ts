import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { Socket } from 'socket.io';

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
    public async handleCreateTask(@MessageBody() createTaskDTO: any): Promise<WsResponse<any>> {
        const task = await this.taskService.createTask(createTaskDTO);

        return { event: 'createdTask', data: task };
    }

    @SubscribeMessage('updateTask')
    public async handleUpdateTask(@MessageBody() updateTaskDTO: any): Promise<WsResponse<any>> {
        const task = await this.taskService.updateTask(updateTaskDTO);

        return { event: 'updatedTask', data: task };
    }

    @SubscribeMessage('deleteTask')
    public async handleDeleteTask(@MessageBody() deleteTaskDTO: any): Promise<WsResponse<{ message: string }>> {
        await this.taskService.deleteTask(deleteTaskDTO);

        return { event: 'deletedTask', data: { message: 'Task deleted successfully' } };
    }

    @SubscribeMessage('getListOfTaskTasks')
    public async handleGetListOfTaskTasks(@MessageBody() getListOfTaskTasksDTO: any): Promise<WsResponse<{ tasks: any[]; total: number }>> {
        const tasks = await this.taskService.getListOfTaskTasks(getListOfTaskTasksDTO);

        return { event: 'gotListOfTaskTasks', data: tasks };
    }
}
