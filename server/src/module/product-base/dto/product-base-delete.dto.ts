import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteProductBaseDto {
    @IsNotEmpty()
    @IsUUID('all', { each: true })
    ids: string[];
}
