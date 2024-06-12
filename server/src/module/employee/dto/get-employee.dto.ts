import { IsNotEmpty, IsUUID } from 'class-validator';
import { DynamicQuery } from '../../../common/type/query.type';

export class FindEmployeeQueryDto extends DynamicQuery {}

export class GetEmployeeParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
