import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetProductBaseParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
