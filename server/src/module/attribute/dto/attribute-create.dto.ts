import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAttributeDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @IsOptional()
    @IsString()
    description: string;
}
