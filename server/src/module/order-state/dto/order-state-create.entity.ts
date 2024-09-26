import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { OrderStatusEnum } from '../../../common/enum/order.enum';

export class CreateOrderStateDto {
    @IsNotEmpty()
    @IsUUID('all')
    orderId: string;

    @IsNotEmpty()
    @IsUUID('all')
    userId: string;

    @IsNotEmpty()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsEnum(OrderStatusEnum)
    state: OrderStatusEnum;
}
