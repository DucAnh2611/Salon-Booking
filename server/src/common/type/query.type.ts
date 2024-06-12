import { Transform, Type } from 'class-transformer';
import { IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { DEFAULT_VALUE_VALIDATOR } from '../constant/entity.constant';
import { OperatorEnum, SortByEnum } from '../enum/query.enum';

export class TFilterBy {
    @IsString()
    field: string;

    @IsEnum(OperatorEnum)
    operator: OperatorEnum;

    @IsString()
    value: string;
}

export class TSortBy {
    @IsString()
    field: string;

    @IsEnum(SortByEnum)
    sort: SortByEnum;
}

export abstract class PaginationQuery {
    @IsOptional()
    @Transform(({ value }: { value: number }) => Number(value))
    page: number = DEFAULT_VALUE_VALIDATOR.page;

    @IsOptional()
    @Transform(({ value }: { value: number }) => Number(value))
    limit: number = DEFAULT_VALUE_VALIDATOR.limit;
}

export abstract class DynamicQuery extends PaginationQuery {
    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => TSortBy)
    sort: TSortBy[] = DEFAULT_VALUE_VALIDATOR.array;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => TFilterBy)
    filter: TFilterBy[] = DEFAULT_VALUE_VALIDATOR.array;
}
