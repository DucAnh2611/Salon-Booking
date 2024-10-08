import { Type } from 'class-transformer';
import {
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import { OrderPaymentTypeEnum } from '../../../common/enum/order.enum';
import { CreateOrderProductItemDto } from '../../order-product-item/dto/order-product-item-create.dto';
import { CreateOrderServiceItemDto } from '../../order-service-item/dto/order-service-item-create.dto';

export class OrderContactDto {
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
}

export class CreateOrderProductDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => OrderContactDto)
    contact: OrderContactDto;

    @IsNotEmpty()
    @IsEnum(OrderPaymentTypeEnum)
    paymentType: OrderPaymentTypeEnum;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderProductItemDto)
    products: CreateOrderProductItemDto[];
}
export class OrderServiceContactDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    phone: string;

    @IsOptional()
    @IsString()
    note?: string;
}

export class CreateOrderServiceDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => OrderServiceContactDto)
    contact: OrderServiceContactDto;

    @IsNotEmpty()
    @IsEnum(OrderPaymentTypeEnum)
    paymentType: OrderPaymentTypeEnum;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderServiceItemDto)
    services: CreateOrderServiceItemDto[];
}

export class CreateOrderRefundRequestAdminDto {
    @IsNotEmpty()
    @IsUUID('all')
    orderId: string;

    @IsNotEmpty()
    @IsUUID('all')
    transactionId: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    @IsInt()
    amount: number;

    @IsNotEmpty()
    @IsString()
    accountName: string;

    @IsNotEmpty()
    @IsString()
    accountNumber: string;

    @IsNotEmpty()
    @IsString()
    accountBankBin: string;

    @IsOptional()
    @IsString()
    note?: string;
}
