import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { OrderType } from '../../../common/enum/order.enum';

export class GetOrderParamDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}

export class GetRequestRefundParamDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}

export class GetOrderTrackingParamDto {
    @IsNotEmpty()
    @IsString()
    code: string;
}

export class GetOrderRequestRefundParamDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}

type TrackingDetailType = 'state' | 'refund' | 'transaction' | 'product' | 'service';

export class TrackingDetailOrderDto {
    type: TrackingDetailType;
    orderId: string;
}

export class GetOrderStateListQueryDto {
    @IsNotEmpty()
    @IsEnum(OrderType)
    type: OrderType;
}
