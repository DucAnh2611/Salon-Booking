import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetAttributeParamDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;
}
