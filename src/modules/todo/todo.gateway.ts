import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, OnGatewayInit, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class TodoGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    private logger: Logger = new Logger('TodoGateway');

    @SubscribeMessage('msgToServer')
    public handleMessage(client: Socket, payload: string): void {
        this.server.emit('msgToClient', payload);
    }

    public afterInit(server: Server) {
        this.logger.log('Init');
    }

    public handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    public handleConnection(client: Socket) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}
