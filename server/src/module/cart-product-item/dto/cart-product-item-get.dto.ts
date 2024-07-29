import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetCartProductParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
