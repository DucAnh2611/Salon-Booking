import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    title: string;

    deletable: boolean;
}

export class AddNewRoleDto {
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsUUID('all', { each: true })
    permissions: string[];
}
