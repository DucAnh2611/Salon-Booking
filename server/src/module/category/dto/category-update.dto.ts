import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsUUID('all')
    parentId?: string;

    @IsOptional()
    @IsUUID('all')
    imageId?: string;
}
