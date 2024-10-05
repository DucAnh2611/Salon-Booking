import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SOCKET_HOST } from '../../../common/constant/socket.constant';
import { SocketMessageEnum } from '../../../common/enum/socket.enum';
import { EmployeeJoiRoomData } from '../interface/me-gateway.interface';

@Injectable()
@WebSocketGateway({ cors: true })
export class EmployeeGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage(SocketMessageEnum.EPLOYEE_JOIN_HOST)
    employeeJoin(socket: Socket, data: EmployeeJoiRoomData) {
        socket.join(SOCKET_HOST.EMPLOYEE);
    }
}
