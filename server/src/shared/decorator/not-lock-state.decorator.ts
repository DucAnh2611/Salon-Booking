import { Reflector } from '@nestjs/core';
import { LockStateEnum } from '../../common/enum/lock-state.enum';

export const NotLockState = Reflector.createDecorator<LockStateEnum[] | undefined>();
