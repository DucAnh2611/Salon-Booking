import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SOCKET_HOST } from '../../../constant/socket.constant';
import { SocketMessageEnum } from '../../../enum/socket.enum';

@Injectable()
@WebSocketGateway({ cors: true })
export class ClientGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage(SocketMessageEnum.CLIENT_JOIN_HOST)
    clientJoin(socket: Socket) {
        socket.join(SOCKET_HOST.CLIENT);
    }
}
