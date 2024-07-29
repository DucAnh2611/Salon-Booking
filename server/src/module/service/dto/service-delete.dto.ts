import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteServiceDto {
    @IsNotEmpty()
    @IsUUID('all', { each: true })
    ids: string[];
}
