import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderType } from '../../../common/enum/order.enum';
import { PaginationQuery } from '../../../common/type/query.type';

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

export class GetJobQueryListDto extends PaginationQuery {
    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    from?: Date;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    to?: Date;
}
