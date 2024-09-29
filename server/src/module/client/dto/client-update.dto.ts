import { IsBoolean, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class ClientUpdateLockDto {
    @IsNotEmpty()
    @IsUUID('all')
    clientId: string;

    @IsOptional()
    @IsBoolean()
    lockAccount?: boolean;

    @IsOptional()
    @IsBoolean()
    lockOrder?: boolean;
}
