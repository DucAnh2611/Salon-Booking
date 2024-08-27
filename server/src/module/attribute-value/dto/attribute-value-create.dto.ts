import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateAttributeValueDto {
    @IsNotEmpty()
    @IsUUID('all')
    attributeId: string;

    @IsNotEmpty()
    @IsUUID('all')
    tempId: string;

    @IsNotEmpty()
    @IsString()
    value: string;
}
