import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProductBaseMediaURLDto {
    @IsNotEmpty()
    @IsString()
    url: string;

    @IsOptional()
    @IsBoolean()
    isThumbnail: boolean = false;
}

export class ProductBaseMediaIdDto {
    @IsNotEmpty()
    @IsUUID('all')
    id: string;

    @IsOptional()
    @IsBoolean()
    isThumbnail: boolean = false;
}
