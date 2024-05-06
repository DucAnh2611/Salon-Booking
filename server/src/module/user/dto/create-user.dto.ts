import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GenderEnum } from '../../../common/enum/gender.enum';

export class CreateUserDto {
  @IsOptional()
  @IsDate()
  birthday?: Date;

  @IsNotEmpty()
  // @IsEnum(GenderEnum)
  gender: GenderEnum;

  @IsNotEmpty()
  // @IsEmail()
  email: string;

  @IsNotEmpty()
  // @IsStrongPassword()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  firstname: string;

  @IsNotEmpty()
  @IsString()
  lastname: string;

  roleId?: string;
}
