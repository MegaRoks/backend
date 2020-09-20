import { Logger, UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, MessageBody, WsResponse } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { CreateTodoDTO } from './dto/createTodo.dto';
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
        console.log(client.handshake.query);

        this.server.emit('msgToClient', payload);
    }

    public afterInit() {
        this.logger.log('Init');
    }

    public handleDisconnect(client: Socket) {
        console.log(client.handshake.query);
        
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    public handleConnection(client: Socket) {
        c
        
        
        this.logger.log(`Client connected: ${client.id}`);
    }

    @SubscribeMessage('createTodo')
    public handleCreateTodo(@MessageBody() createTodoDTO: CreateTodoDTO): Promise<WsResponse<any>> {
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
