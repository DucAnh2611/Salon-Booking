import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQuery } from '../../../type/query.type';

export class FindEmployeeQueryDto extends PaginationQuery {
    @IsOptional()
    @IsString()
    key?: string;

    @IsOptional()
    @IsString()
    orderBy?: string;
}

export class GetEmployeeParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
