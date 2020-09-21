import { UseGuards } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    MessageBody,
    WsResponse,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { TokenGuard } from './../token/guards/token.guard';
import { CreateTodoDTO } from './dto/createTodo.dto';
import { TodoService } from './todo.service';

@UseGuards(TokenGuard)
@WebSocketGateway()
export class TodoGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly todoService: TodoService) {}

    @WebSocketServer()
    private server: Server;

    public handleDisconnect(@ConnectedSocket() client: Socket) {
        // console.log('Disconnected', client.handshake.query.token);
    }

    public handleConnection(@ConnectedSocket() client: Socket) {
        // console.log('Connected', client.handshake.query.token);
    }

    @SubscribeMessage('createTodo')
    public handleCreateTodo(@ConnectedSocket() client: Socket, @MessageBody() createTodoDTO: CreateTodoDTO): Promise<WsResponse<any>> {
        console.log('createTodo', client.handshake.query.token);

        return this.todoService.createTodo(createTodoDTO);
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
