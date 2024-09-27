import { Reflector } from '@nestjs/core';
import { UserTypeEnum } from '../../common/enum/user.enum';

export const UserType = Reflector.createDecorator<UserTypeEnum | undefined>();
