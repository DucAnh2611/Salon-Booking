import { Reflector } from '@nestjs/core';
import { LockStateEnum } from '../enum/lock-state.enum';

export const NotLockState = Reflector.createDecorator<LockStateEnum[] | undefined>();
