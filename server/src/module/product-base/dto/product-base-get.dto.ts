import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';
import { DEFAULT_VALUE_VALIDATOR } from '../../../common/constant/entity.constant';
import { PaginationQuery } from '../../../common/type/query.type';

export class GetProductBaseParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}

export class FindProductByPriceDto {
    @IsNotEmpty()
    @IsNumber()
    from: number = 0;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    to?: number;
}
export class FindProductBaseAdminDto extends PaginationQuery {
    @IsOptional()
    @IsString()
    key: string = DEFAULT_VALUE_VALIDATOR.string;

    @IsOptional()
    @IsString({ each: true })
    orderBy?: string = DEFAULT_VALUE_VALIDATOR.string;
}

export class FindProductBaseDto extends PaginationQuery {
    @IsOptional()
    @IsString()
    key: string = DEFAULT_VALUE_VALIDATOR.string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => FindProductByPriceDto)
    price: FindProductByPriceDto;

    @IsOptional()
    @IsUUID('all', { each: true })
    categoryIds?: string[];

    @IsOptional()
    @IsString()
    orderBy?: string;
}
