import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IsUUID, ValidateNested } from 'class-validator';
import { ServiceMediaDto } from '../../service-media/dto/service-media-create.dto';

export class CreateServiceBaseDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @IsPositive()
    duration: number;

    @IsNotEmpty()
    @IsNumber()
    @IsInt()
    @IsPositive()
    price: number;

    @IsOptional()
    @IsUUID('all')
    parentId?: string;

    @IsNotEmpty()
    @IsUUID('all')
    categoryId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ServiceMediaDto)
    medias: ServiceMediaDto[];
}
