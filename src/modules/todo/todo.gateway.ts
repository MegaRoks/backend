import { UseGuards } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WsResponse, ConnectedSocket } from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { TokenGuard } from './../token/guards/token.guard';
import { GetTodoDTO } from './decorators/getTodoDTO.decorator';
import { CreateTodoDTO } from './dto/createTodo.dto';
import { DeleteTodoDTO } from './dto/deleteTodo.dto';
import { GetListTodoOfUserDTO } from './dto/getListTodoOfUser.dto';
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
    public async handleCreateTodo(@GetTodoDTO() createTodoDTO: CreateTodoDTO): Promise<WsResponse<Todo>> {
        const todo = await this.todoService.createTodo({ title: createTodoDTO.title, userId: createTodoDTO.userId });
        return { event: 'createdTodo', data: todo };
    }

    @SubscribeMessage('updateTodo')
    public async handleUpdateTodo(@GetTodoDTO() updateTodoDTO: UpdateTodoDTO): Promise<WsResponse<Todo>> {
        const todo = await this.todoService.updateTodo(updateTodoDTO);

        return { event: 'updatedTodo', data: todo };
    }

    @SubscribeMessage('deleteTodo')
    public async handleDeleteTodo(@GetTodoDTO() deleteTodoDTO: DeleteTodoDTO): Promise<WsResponse<{ message: string }>> {
        await this.todoService.deleteTodo(deleteTodoDTO);

        return { event: 'updatedTodo', data: { message: 'Todo deleted successfully' } };
    }

    @SubscribeMessage('getListTodo')
    public async handleListTodo(@GetTodoDTO() getListTodoOfUserDTO: GetListTodoOfUserDTO): Promise<WsResponse<{ todos: Todo[]; total: number }>> {
        const todos = await this.todoService.getListOfUserTodos(getListTodoOfUserDTO);

        return { event: 'updatedTodo', data: todos };
    }
}
