import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { DEFAULT_VALUE_VALIDATOR } from '../../../common/constant/entity.constant';
import { PaginationQuery } from '../../../common/type/query.type';
import { MediaTypesEnum } from '../enum/media-types.enum';

export class FindMediaAdminQuery extends PaginationQuery {
    @IsOptional()
    @IsString()
    key?: string = DEFAULT_VALUE_VALIDATOR.string;

    @IsOptional()
    @IsString()
    orderBy?: string = DEFAULT_VALUE_VALIDATOR.string;

    @IsOptional()
    @IsEnum(MediaTypesEnum)
    type?: MediaTypesEnum;
}

export class GetMediaParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
