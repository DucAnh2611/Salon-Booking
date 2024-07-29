import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetProductDetailParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
