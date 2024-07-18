import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { PaginationQuery } from '../../../common/type/query.type';

export class GetParamCategoryDto {
    @IsNotEmpty()
    @IsUUID()
    id: string;
}

export class FindCategoryDto {
    @IsOptional()
    @IsString()
    key?: string;
}
export class FindCategoryAdminDto extends PaginationQuery {
    @IsOptional()
    @IsString()
    key?: string;

    @IsOptional()
    @IsString()
    orderBy?: string;
}
