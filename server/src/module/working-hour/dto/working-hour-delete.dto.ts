import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteWorkingHourDto {
    @IsNotEmpty()
    @IsUUID('all', { each: true })
    workingHourIds: string[];
}
