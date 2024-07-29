import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteEmployeeDto {
    @IsNotEmpty()
    @IsUUID('all', { each: true })
    ids: string[];
}
