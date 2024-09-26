import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';
import { DEFAULT_VALUE_VALIDATOR } from '../../../common/constant/entity.constant';
import { PaginationQuery } from '../../../common/type/query.type';

export class FindServiceByPriceDto {
    @IsNotEmpty()
    @IsNumber()
    from: number = 0;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    to?: number;
}

export class FindServiceBaseDto extends PaginationQuery {
    @IsOptional()
    @IsString()
    key: string = DEFAULT_VALUE_VALIDATOR.string;

    @IsNotEmpty()
    @ValidateNested()
    @Type(() => FindServiceByPriceDto)
    price: FindServiceByPriceDto;

    @IsOptional()
    @IsUUID('all', { each: true })
    categoryIds?: string[];
}
