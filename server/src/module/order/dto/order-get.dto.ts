import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetOrderParamDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}

export class GetOrderRequestRefundParamDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}
