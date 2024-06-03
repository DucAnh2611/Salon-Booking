import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { DEFAULT_VALUE_VALIDATOR } from '../constant/entity.constant';

export abstract class PaginationQuery {
    @IsOptional()
    @Transform(({ value }: { value: number }) => Number(value))
    page: number = DEFAULT_VALUE_VALIDATOR.page;

    @IsOptional()
    @Transform(({ value }: { value: number }) => Number(value))
    limit: number = DEFAULT_VALUE_VALIDATOR.limit;
}
