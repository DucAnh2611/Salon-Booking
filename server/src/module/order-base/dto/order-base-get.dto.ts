import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OrderPaymentTypeEnum, OrderStatusEnum, OrderType } from '../../../common/enum/order.enum';
import { SortByEnum } from '../../../common/enum/query.enum';
import { PaginationQuery } from '../../../common/type/query.type';

export class FindOrderClientFilterDto {
    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsEnum(OrderStatusEnum)
    status?: OrderStatusEnum;

    @IsOptional()
    @IsEnum(OrderType)
    type?: OrderType;

    @IsOptional()
    @IsEnum(OrderPaymentTypeEnum)
    paymentType?: OrderPaymentTypeEnum;

    @IsOptional()
    @IsBoolean()
    paid?: boolean;

    @IsOptional()
    @IsBoolean()
    refund?: boolean;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    from?: Date;

    @IsOptional()
    @Transform(({ value }) => new Date(value))
    @IsDate()
    to?: Date;
}

export class FindOrderClientOrderDto {
    @IsOptional()
    @IsEnum(SortByEnum)
    code?: SortByEnum;

    @IsOptional()
    @IsEnum(SortByEnum)
    status?: SortByEnum;

    @IsOptional()
    @IsEnum(SortByEnum)
    paid?: SortByEnum;

    @IsOptional()
    @IsEnum(SortByEnum)
    refund?: SortByEnum;

    @IsOptional()
    @IsEnum(SortByEnum)
    createdAt?: SortByEnum;

    @IsOptional()
    @IsEnum(SortByEnum)
    updatedAt?: SortByEnum;

    @IsOptional()
    @IsEnum(SortByEnum)
    total?: SortByEnum;
}

export class FindOrderClientDto extends PaginationQuery {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => FindOrderClientFilterDto)
    filter: FindOrderClientFilterDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => FindOrderClientOrderDto)
    order: FindOrderClientOrderDto;
}
