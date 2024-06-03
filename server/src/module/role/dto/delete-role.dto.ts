import { IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteManyRoleDtop {
    @IsNotEmpty()
    @IsUUID('all', { each: true })
    roleIds: string[];
}
