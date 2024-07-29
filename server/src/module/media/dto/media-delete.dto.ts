import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteMediaDto {
    @IsNotEmpty()
    @IsUUID('all', { each: true })
    ids: string[];
}
