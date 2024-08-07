import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
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
    @Type(() => Number)
    @IsNumber()
    @IsInt()
    @IsPositive()
    page?: number = DEFAULT_VALUE_VALIDATOR.page;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @IsInt()
    @IsPositive()
    limit?: number = DEFAULT_VALUE_VALIDATOR.limit;
}
export abstract class DynamicQuery extends PaginationQuery {
    /*
        @format: /<path>?filter=<field>:<value>&&sort=<"d"|"a"><field>&&page=<page>&&limit=<limit>
        @default:
            filter: '',
            sort: '',
            page: 1,
            limit: 10    
    */
    @IsOptional()
    @IsString()
    sort: string;

    @IsOptional()
    @IsString()
    filter: string;
}

export type TParsedQuery = {
    page: number;
    limit: number;
    sort: { [key: string]: SortByEnum };
    filter: { [key: string]: string };
};
