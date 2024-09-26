import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateTypeAttributeValueDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;

    @IsNotEmpty()
    @IsString()
    value: string;
}
