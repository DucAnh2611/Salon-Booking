import { IsOptional, IsString } from 'class-validator';

export class MediaUpdateDto {
    @IsOptional()
    @IsString()
    title: string;
}
