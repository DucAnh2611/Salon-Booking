import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteManyCategoryDto {
    @IsNotEmpty()
    @IsUUID('all', { each: true })
    ids: string[];
}
