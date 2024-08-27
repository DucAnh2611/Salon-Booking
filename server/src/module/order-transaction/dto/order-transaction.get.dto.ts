import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { OrderTransactionReturnPayos } from '../../../common/enum/order.enum';

export class ReturnUrlTransactionPayOsDto {
    @IsNotEmpty()
    @IsString()
    code: string;

    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsBoolean()
    cancel: boolean;

    @IsNotEmpty()
    @IsEnum(OrderTransactionReturnPayos)
    status: OrderTransactionReturnPayos;

    @IsNotEmpty()
    @IsNumber()
    orderCode: number;
}
