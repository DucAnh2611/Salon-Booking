import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator';
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
}
