import { Injectable } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SOCKET_HOST } from '../../../common/constant/socket.constant';
import { SocketEventEnum, SocketMessageEnum } from '../../../common/enum/socket.enum';
import { ClientTrackingMessage, PlaceOrderMessage } from '../interface/order-gateway.interface';

@Injectable()
@WebSocketGateway({ cors: true })
export class OrderGateway {
    @WebSocketServer()
    server: Server;

    placedOrder(message: PlaceOrderMessage) {
        this.server.to(SOCKET_HOST.EMPLOYEE).emit(SocketEventEnum.ORDER_PLACED, message);
    }

    adminUpdateOrder(message: any) {
        const { orderId } = message;
        this.server.to(orderId).emit(SocketEventEnum.EMPLOYEE_ORDER_UPDATED, {});
    }

    clientUpdateOrder(message: any) {
        const { orderId } = message;
        this.server.to(orderId).emit(SocketEventEnum.CLIENT_ORDER_UPDATED, {});
    }

    @SubscribeMessage(SocketMessageEnum.CLIENT_TRACKING_ORDER)
    clientTracking(socket: Socket, message: ClientTrackingMessage) {
        const { orderId } = message;
        socket.join(orderId);
    }

    @SubscribeMessage(SocketMessageEnum.EMPLOYEE_TRACKING_ORDER)
    employeeTracking(socket: Socket, message: ClientTrackingMessage) {
        const { orderId } = message;
        socket.join(orderId);
    }

    @SubscribeMessage(SocketMessageEnum.CLIENT_UNTRACK_ORDER)
    clientUntrack(socket: Socket, message: ClientTrackingMessage) {
        const { orderId } = message;
        socket.leave(orderId);
    }

    @SubscribeMessage(SocketMessageEnum.EMPLOYEE_UNTRACK_ORDER)
    employeeUntrack(socket: Socket, message: ClientTrackingMessage) {
        const { orderId } = message;
        socket.leave(orderId);
    }
}
