import { Transform } from 'class-transformer';
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
    @Transform(({ value }) => Boolean(value))
    @IsBoolean()
    cancel: boolean;

    @IsNotEmpty()
    @IsEnum(OrderTransactionReturnPayos)
    status: OrderTransactionReturnPayos;

    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    orderCode: number;
}
