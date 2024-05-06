import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from '../../user/dto/create-user.dto';

export class CreateAuthDto {}

export class CreateEmpDto extends CreateUserDto {
  @IsNotEmpty()
  @IsString()
  username: string;
}
