import { Type } from 'class-transformer';
import { IsNotEmpty, IsUUID, ValidateNested } from 'class-validator';
import { ServiceMediaDto } from './service-media-create.dto';

export class BodyUpdateServiceMediaDto {
    @IsNotEmpty()
    @IsUUID('all')
    serviceId: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => ServiceMediaDto)
    medias: ServiceMediaDto[];
}
