import { IsEnum, IsNotEmpty } from 'class-validator';

export type OrderCancelType = 'none' | 'refundable' | 'no_refund';

export class OrderCancelQueryDto {
    @IsNotEmpty()
    @IsEnum(['none', 'refundable', 'no_refund'])
    type: OrderCancelType;
}
