import { UseGuards } from '@nestjs/common';
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WsResponse,
    ConnectedSocket,
    MessageBody,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { TokenGuard } from './../token/guards/token.guard';
import { GetUserId } from './../user/decorators/getUserId.decorator';
import { CreateTodoDTO } from './dto/createTodo.dto';
import { DeleteTodoDTO } from './dto/deleteTodo.dto';
import { GetListTodosDTO } from './dto/getListTodos.dto';
import { UpdateTodoDTO } from './dto/updateTodo.dto';
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
    public async handleCreateTodo(@GetUserId() userId: string, @MessageBody() createTodoDTO: CreateTodoDTO): Promise<WsResponse<Todo>> {
        const todo = await this.todoService.createTodo(userId, createTodoDTO);

        return { event: 'createdTodo', data: todo };
    }

    @SubscribeMessage('updateTodo')
    public async handleUpdateTodo(@GetUserId() userId: string, @MessageBody() updateTodoDTO: UpdateTodoDTO): Promise<WsResponse<Todo>> {
        const todo = await this.todoService.updateTodo(userId, updateTodoDTO);

        return { event: 'updatedTodo', data: todo };
    }

    @SubscribeMessage('deleteTodo')
    public async handleDeleteTodo(
        @GetUserId() userId: string,
        @MessageBody() deleteTodoDTO: DeleteTodoDTO,
    ): Promise<WsResponse<{ message: string }>> {
        await this.todoService.deleteTodo(userId, deleteTodoDTO);

        return { event: 'deletedTodo', data: { message: 'Todo deleted successfully' } };
    }

    @SubscribeMessage('getListOfUserTodos')
    public async handleGetListOfUSerTodos(@MessageBody() getListTodosDTO: GetListTodosDTO): Promise<WsResponse<{ todos: Todo[]; total: number }>> {
        console.log('getListTodosDTO', getListTodosDTO);

        const todos = await this.todoService.getListOfUserTodos(getListTodosDTO);

        return { event: 'gotListOfUserTodos', data: todos };
    }
}
