import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderStatusEnum, OrderType } from '../../../common/enum/order.enum';

export class ClientUpdateOrderStateDto {
    @IsNotEmpty()
    @IsUUID('all')
    orderId: string;

    @IsNotEmpty()
    @IsEnum(OrderStatusEnum)
    state: OrderStatusEnum;
}
export class StaffUpdateOrderStateDto {
    @IsNotEmpty()
    @IsUUID('all')
    orderId: string;

    @IsNotEmpty()
    @IsEnum(OrderStatusEnum)
    state: OrderStatusEnum;

    @IsOptional()
    @IsString()
    description?: string;
}

export class StaffCancelOrderStateDto {
    @IsNotEmpty()
    @IsUUID('all')
    orderId: string;

    @IsNotEmpty()
    @IsString()
    reason: string;
}

export class ClientCancelOrderStateDto {
    @IsNotEmpty()
    @IsUUID('all')
    orderId: string;

    @IsNotEmpty()
    @IsString()
    reason: string;
}

export class DeclineRefundRequestDto {
    @IsNotEmpty()
    @IsUUID('all')
    requestId: string;

    @IsNotEmpty()
    @IsString()
    note: string;
}

export class ApprovedRefundRequestDto {
    @IsNotEmpty()
    @IsUUID('all')
    requestId: string;

    @IsNotEmpty()
    @IsString()
    bankTransactionCode: string;

    @IsOptional()
    @IsString()
    mediaUrl?: string;

    @IsOptional()
    @IsString()
    mediaId?: string;

    @IsOptional()
    @IsString()
    note?: string;
}

export class UpdateOrderStateDto {
    @IsNotEmpty()
    @IsEnum(OrderType)
    type: OrderType;

    @IsNotEmpty()
    @IsEnum(OrderStatusEnum)
    state: OrderStatusEnum;
}
