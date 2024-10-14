import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketEventEnum, SocketMessageEnum } from '../../common/enum/socket.enum';
import { ListenRefund, SuccessRefund } from './interface/webhook-gateway';

@Injectable()
@WebSocketGateway({ cors: true })
export class WebhookGateway {
    @WebSocketServer()
    server: Server;

    successRefundTransaction(payload: SuccessRefund) {
        const { code } = payload;
        this.server.to(code).emit(SocketEventEnum.SUCCESS_REFUND_REQUEST, payload);
    }

    @SubscribeMessage(SocketMessageEnum.LISTEN_REFUND_REQUEST)
    listenRefundTransaction(socket: Socket, payload: ListenRefund) {
        const { code } = payload;
        socket.join(code);
    }

    @SubscribeMessage(SocketMessageEnum.LEAVE_REFUND_REQUEST)
    leaveRefundTransaction(socket: Socket, payload: ListenRefund) {
        const { code } = payload;
        socket.leave(code);
    }
}
