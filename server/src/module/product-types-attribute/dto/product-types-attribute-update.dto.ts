import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateProductTypesAttributeDto {
    @IsNotEmpty()
    @IsUUID('all')
    productTypesId: string;

    @IsNotEmpty()
    @IsUUID('all')
    attrId: string;

    @IsNotEmpty()
    @IsString()
    value: string;

    @IsOptional()
    @IsUUID('all')
    mediaId?: string;

    @IsOptional()
    @IsString()
    mediaUrl?: string;
}
