import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { OrderRefundRequestStatusEnum } from '../../../common/enum/order.enum';

export class UpdateOrderRefundRequestDto {
    @IsNotEmpty()
    @IsUUID('all')
    requestId: string;

    @IsNotEmpty()
    @IsUUID('all')
    userId: string;

    @IsNotEmpty()
    @IsEnum(OrderRefundRequestStatusEnum)
    status: OrderRefundRequestStatusEnum;

    @IsOptional()
    @IsString()
    reference?: string;
}
