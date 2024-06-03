import { IsString } from 'class-validator';

export class CreateRoleDto {
    @IsString()
    title: string;

    deletable: boolean;
}

export class AddNewRoleDto {
    @IsString()
    title: string;
}
