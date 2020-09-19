import { Logger, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { TodoService } from './todo.service';

@UseGuards()
@WebSocketGateway()
export class TodoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly todoService: TodoService) {}

    @WebSocketServer()
    private server: Server;

    private logger: Logger = new Logger('TodoGateway');

    @SubscribeMessage('msgToServer')
    public handleMessage(client: Socket, payload: string): void {
        this.server.emit('msgToClient', payload);
    }

    public afterInit() {
        this.logger.log('Init');
    }

    public handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    public handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('createTodo')
    public handleCreateTodo(@MessageBody() data: any): Promise<WsResponse<any>> {
        return this.todoService.createTodo(data);
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
