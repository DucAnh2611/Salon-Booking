import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteManyVoucherDto {
    @IsNotEmpty()
    @IsUUID('all', { each: true })
    ids: string[];
}
