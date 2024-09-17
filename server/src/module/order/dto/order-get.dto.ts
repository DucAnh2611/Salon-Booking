import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class GetOrderParamDto {
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
