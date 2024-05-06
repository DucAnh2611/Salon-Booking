import { PermissionActionEnum, PermissionTargetEnum } from '../../../common/enum/permission.enum';

export class CreatePermissionDto {
  action: PermissionActionEnum;
  target: PermissionTargetEnum;
}
