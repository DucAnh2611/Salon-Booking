import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { SortByEnum } from '../../../common/enum/query.enum';
import { PaginationQuery } from '../../../common/type/query.type';

export class FilterSearchClientDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsBoolean()
    lockAccount?: boolean;

    @IsOptional()
    @IsBoolean()
    lockOrder?: boolean;
}
export class OrderSearchClientDto {
    @IsOptional()
    @IsString()
    createdAt?: SortByEnum;

    @IsOptional()
    @IsString()
    updatedAt?: SortByEnum;
}

export class SearchClientDto extends PaginationQuery {
    @IsNotEmpty()
    @ValidateNested()
    @Type(() => FilterSearchClientDto)
    filter: FilterSearchClientDto;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => OrderSearchClientDto)
    order: OrderSearchClientDto;
}

export class CheckResetPasswordSignatureDto {
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    token: string;
}

export class GetQueryCheckEmailDto {
    @IsNotEmpty()
    @IsString()
    email: string;
}
