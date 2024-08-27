import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { OrderStatusEnum } from '../../../common/enum/order.enum';
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
    @IsBoolean()
    paid?: boolean;

    @IsOptional()
    @IsBoolean()
    refund?: boolean;
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
