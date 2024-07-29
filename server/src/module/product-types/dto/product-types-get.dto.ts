import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetProductTypesParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
