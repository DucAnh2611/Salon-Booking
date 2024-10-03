import { IsNotEmpty, IsUUID } from 'class-validator';
import { PaginationQuery } from '../../../common/type/query.type';

export class OrganizationGetParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}

export class OrganizationListDto extends PaginationQuery {}
