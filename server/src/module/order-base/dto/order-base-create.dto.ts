import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { OrderPaymentTypeEnum } from '../../../common/enum/order.enum';

export class CreateOrderBaseDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    note?: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    total: number;

    @IsNotEmpty()
    @IsEnum(OrderPaymentTypeEnum)
    paymentType: OrderPaymentTypeEnum;
}
