import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateAttributeDto {
    @IsNotEmpty()
    @IsString()
    @Length(50)
    name: string;

    @IsOptional()
    @IsString()
    description: string;
}
