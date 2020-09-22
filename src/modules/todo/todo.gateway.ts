import { UseGuards } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    WsResponse,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { TokenGuard } from './../token/guards/token.guard';
import { GetTodoDTO } from './decorators/getTodoDTO.decorator';
import { CreateTodoDTO } from './dto/createTodo.dto';
import { TodoService } from './todo.service';

@UseGuards(TokenGuard)
@WebSocketGateway()
export class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly todoService: TodoService) {}

    public handleDisconnect(@ConnectedSocket() client: Socket) {
        console.log('Disconnected', client.id);
    }

    public handleConnection(@ConnectedSocket() client: Socket) {
        console.log('Connected', client.id);
    }

    @SubscribeMessage('createTodo')
    public handleCreateTodo(@GetTodoDTO() createTodoDTO: CreateTodoDTO): Promise<WsResponse<any>> {
        return this.todoService.createTodo({ title: createTodoDTO.title, userId: createTodoDTO.userId });
    }

    @SubscribeMessage('updateTodo')
    public handleUpdateTodo(@MessageBody() data: any): Promise<WsResponse<any>> {
        return this.todoService.updateTodo(data);
    }

    @SubscribeMessage('deleteTodo')
    public handleDeleteTodo(@MessageBody() data: any): Promise<WsResponse<number>> {
        return this.todoService.deleteTodo(data);
    }

    @SubscribeMessage('getListTodo')
    public handleListTodo(@MessageBody() data: any): Promise<WsResponse<any>> {
        return this.todoService.getListOfUserTodos(data);
    }
}
