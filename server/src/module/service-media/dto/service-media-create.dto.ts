import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';

export class ServiceMediaDto {
    @IsOptional()
    @IsUUID('all')
    mediaId?: string;

    @IsOptional()
    @IsString()
    mediaUrl?: string;

    @IsOptional()
    @IsBoolean()
    isThumbnail: boolean = false;
}

export class BodyCreateServiceMediaDto {
    @IsNotEmpty()
    @IsUUID('all')
    serviceId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ServiceMediaDto)
    medias: ServiceMediaDto[];
}
