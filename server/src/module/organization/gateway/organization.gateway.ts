import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketEventEnum } from '../../../common/enum/socket.enum';

@Injectable()
@WebSocketGateway({ cors: true })
export class OrganizationGateway {
    @WebSocketServer()
    server: Server;

    updateCurrent() {
        this.server.emit(SocketEventEnum.UPDATE_CURRENT_ORGANIZATION, {});
    }
}
