import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { DEFAULT_VALUE_VALIDATOR } from '../constant/entity.constant';
import { SortByEnum } from '../enum/query.enum';

export abstract class PaginationQuery {
    /*
        @format : /<path>?page=<page>&&limit=<limit>
        @default:
            page: 1,
            limit: 10    
    */
    @IsOptional()
    @Transform(({ value }: { value: number }) => Number(value))
    page: number = DEFAULT_VALUE_VALIDATOR.page;

    @IsOptional()
    @Transform(({ value }: { value: number }) => Number(value))
    limit: number = DEFAULT_VALUE_VALIDATOR.limit;
}
export abstract class DynamicQuery extends PaginationQuery {
    /*
        @format: /<path>?filter=<field>:<value>&&sort=<field>_<desc|asc>&&page=<page>&&limit=<limit>
        @default:
            filter: '',
            sort: '',
            page: 1,
            limit: 10    
    */
    @IsOptional()
    @IsString()
    sort: string = DEFAULT_VALUE_VALIDATOR.string;

    @IsOptional()
    @IsString()
    filter: string = DEFAULT_VALUE_VALIDATOR.string;
}

export type TParsedQuery = {
    page: number;
    limit: number;
    sort: { [key: string]: SortByEnum };
    filter: { [key: string]: string };
};
