import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderRefundStatusEnum } from '../../../common/enum/order.enum';

export class CreateOrderRefundStateDto {
    @IsNotEmpty()
    @IsUUID('all')
    requestId: string;

    @IsNotEmpty()
    @IsUUID('all')
    userId: string;

    @IsNotEmpty()
    @IsEnum(OrderRefundStatusEnum)
    state: OrderRefundStatusEnum;

    @IsOptional()
    @IsUUID('all')
    mediaId?: string;

    @IsOptional()
    @IsUUID('all')
    mediaUrl?: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsOptional()
    @IsString()
    bankTransactionCode?: string;
}
