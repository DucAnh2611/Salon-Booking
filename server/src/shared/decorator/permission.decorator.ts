import { Reflector } from '@nestjs/core';
import { PermissionActionEnum, PermissionTargetEnum } from '../../common/enum/permission.enum';

export type TargetActionType = { target: PermissionTargetEnum; action: PermissionActionEnum[] };

export const TargetActionRequire = Reflector.createDecorator<TargetActionType[]>();
