import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DEFAULT_VALUE_VALIDATOR } from '../../../common/constant/entity.constant';
import { PaginationQuery } from '../../../common/type/query.type';

export class GetAttributeParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}

export class FindAttributeAdminDto extends PaginationQuery {
    @IsOptional()
    @IsString()
    key?: string;

    @IsOptional()
    @IsString()
    orderBy?: string;
}

export class FindAttributeClientDto extends PaginationQuery {
    @IsOptional()
    @IsString()
    key: string = DEFAULT_VALUE_VALIDATOR.string;

    @IsOptional()
    @IsString()
    orderBy?: string;
}
