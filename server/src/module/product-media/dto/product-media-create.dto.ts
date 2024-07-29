import { IsBoolean, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProductMediaDto {
    @IsNotEmpty()
    @IsUUID('all')
    productId: string;

    @IsNotEmpty()
    @IsUUID('all')
    mediaId: string;

    @IsNotEmpty()
    @IsBoolean()
    isThumbnail: boolean;
}
