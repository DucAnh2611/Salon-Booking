import { PermissionActionEnum, PermissionTargetEnum } from '../enum/permission.enum';

export const PERMISSION_CONSTANT = {
    target: {
        product: PermissionTargetEnum.PRODUCT,
        service: PermissionTargetEnum.SERVICE,
        employee: PermissionTargetEnum.EMPLOYEE,
        user: PermissionTargetEnum.USER,
        client: PermissionTargetEnum.CLIENT,
    },
    action: {
        read: PermissionActionEnum.READ,
        create: PermissionActionEnum.CREATE,
        delete: PermissionActionEnum.DELETE,
        update: PermissionActionEnum.UPDATE,
    },
};
