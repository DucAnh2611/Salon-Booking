import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQuery } from '../../../common/type/query.type';

export class VoucherGetParamDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}

export class VoucherFindFilterDto {
    @IsOptional()
    @IsString()
    code?: string;

    @IsOptional()
    @IsString()
    title?: string;
}

export class VoucherFindQueryDto extends PaginationQuery {
    @IsNotEmpty()
    @Type(() => VoucherFindFilterDto)
    filter: VoucherFindFilterDto;

    @IsNotEmpty()
    @IsString({ each: true })
    sort: string[];
}
