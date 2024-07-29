import { Type } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OrderPaymentTypeEnum } from '../../../common/enum/order.enum';
import { CreateOrderProductItemDto } from '../../order-product-item/dto/order-product-item-create.module';
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

export class CreateOrderServiceDto {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => OrderContactDto)
    contact: OrderContactDto;

    @IsNotEmpty()
    @IsEnum(OrderPaymentTypeEnum)
    paymentType: OrderPaymentTypeEnum;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => CreateOrderServiceItemDto)
    services: CreateOrderServiceItemDto[];
}
