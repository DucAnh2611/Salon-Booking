import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateTempMediaDto {
    @IsNotEmpty()
    @IsUUID('all')
    sessionId: string;

    @IsNotEmpty()
    @IsString()
    context: string;
}
