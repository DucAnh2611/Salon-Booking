import { IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class UpdateCategoryDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsNumber()
    @IsInt()
    @IsPositive()
    level?: number;

    @IsOptional()
    @IsUUID('all')
    parentId?: string;

    @IsOptional()
    @IsUUID('all')
    imageId?: string;
}
