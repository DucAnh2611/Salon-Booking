import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DEFAULT_VALUE_VALIDATOR } from '../../../constant/entity.constant';
import { PaginationQuery } from '../../../type/query.type';

export class FindServiceAdminDto extends PaginationQuery {
    @IsOptional()
    @IsString()
    key?: string = DEFAULT_VALUE_VALIDATOR.string;

    @IsOptional()
    @IsString()
    orderBy?: string = DEFAULT_VALUE_VALIDATOR.string;
}

export class GetServiceParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
