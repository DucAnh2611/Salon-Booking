import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteManyAttributeDto {
    @IsNotEmpty()
    @IsUUID('all', { each: true })
    ids: string[];
}
