import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WsResponse, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { TokenGuard } from './../token/guards/token.guard';
import { MessageData } from './../shared/decorators/messageData.decorator';
import { CreateTodoDTO } from './dto/createTodo.dto';
import { DeleteTodoDTO } from './dto/deleteTodo.dto';
import { GetTodosListDTO } from './dto/getTodosList.dto';
import { UpdateTodoDTO } from './dto/updateTodo.dto';
import { FilerTodosDTO } from './dto/filterTodos.dto';
import { Todo } from './entity/todo.entity';
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
    public async handleCreateTodo(@MessageData() createTodoDTO: CreateTodoDTO): Promise<WsResponse<Todo>> {
        const todo = await this.todoService.createTodo(createTodoDTO);
        return { event: 'createdTodo', data: todo };
    }

    @SubscribeMessage('updateTodo')
    public async handleUpdateTodo(@MessageData() updateTodoDTO: UpdateTodoDTO): Promise<WsResponse<Todo>> {
        const todo = await this.todoService.updateTodo(updateTodoDTO);
        return { event: 'updatedTodo', data: todo };
    }

    @SubscribeMessage('deleteTodo')
    public async handleDeleteTodo(@MessageData() deleteTodoDTO: DeleteTodoDTO): Promise<WsResponse<{ message: string }>> {
        await this.todoService.deleteTodo(deleteTodoDTO);
        return { event: 'deletedTodo', data: { message: 'Todo deleted successfully' } };
    }

    @SubscribeMessage('getTodosList')
    public async handleGetTodosList(@MessageData() getListTodosDTO: GetTodosListDTO): Promise<WsResponse<FilerTodosDTO>> {
        const todos = await this.todoService.getTodosList(getListTodosDTO);
        return { event: 'gotTodosList', data: todos };
    }
}
