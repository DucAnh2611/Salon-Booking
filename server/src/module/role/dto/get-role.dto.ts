import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DEFAULT_VALUE_VALIDATOR } from '../../../common/constant/entity.constant';
import { PaginationQuery } from '../../../common/type/query.type';

export class FindRoleDto extends PaginationQuery {
    @IsOptional()
    @IsString()
    key?: string = DEFAULT_VALUE_VALIDATOR.string;
}

export class GetOneRoleDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}
