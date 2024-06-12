import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class CreateEmployeeDto extends CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsUUID('all')
    eRoleId: string;
}
