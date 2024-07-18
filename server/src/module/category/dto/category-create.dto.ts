import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsUUID('all')
    parentId?: string;

    @IsOptional()
    @IsUUID('all')
    imageId?: string;
}
