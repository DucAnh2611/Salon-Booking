import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateTempMediaDto {
    @IsNotEmpty()
    @IsUUID('all')
    sessionId: string;
}
