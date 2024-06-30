import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateCategoryDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @IsPositive()
    level: number;

    @IsOptional()
    @IsUUID('all')
    parentId?: string;

    @IsOptional()
    @IsUUID('all')
    imageId?: string;
}
