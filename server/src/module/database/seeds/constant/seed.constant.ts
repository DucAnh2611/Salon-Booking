import { ROLE_TITLE } from '../../../../common/constant/role.constant';
import { GenderEnum } from '../../../../common/enum/gender.enum';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../../common/enum/permission.enum';
import { CreatePermissionDto } from '../../../permission/dto/create-permission.dto';
import { TSeedData, TSeedRolePermisison } from '../type/seed.type';

export const SEED_DATA: TSeedData = {
    employee: [
        {
            birthday: new Date(),
            gender: GenderEnum.MALE,
            email: 'admin@slbooking.com',
            password: '1',
            firstname: 'Duc',
            lastname: 'Anh',
            username: 'admin1',
            role: ROLE_TITLE.staff,
            eRole: ROLE_TITLE.admin,
        },
    ],
    role: Object.values(ROLE_TITLE).map((title: string) => ({ deletable: false, title })),
    permission: Object.values(PermissionActionEnum).reduce((prev: CreatePermissionDto[], action) => {
        Object.values(PermissionTargetEnum).forEach(target => {
            prev.push({ action, target });
        });
        return prev;
    }, []),
    rolePermission: [
        {
            data: Object.keys(PermissionTargetEnum).reduce((prev: TSeedRolePermisison[], target) => {
                prev.push({
                    action: Object.values(PermissionActionEnum),
                    target: PermissionTargetEnum[target],
                });
                return prev;
            }, []),
            role: ROLE_TITLE.admin,
        },
        {
            data: [
                {
                    target: PermissionTargetEnum.EMPLOYEE,
                    action: [PermissionActionEnum.READ],
                },
            ],
            role: ROLE_TITLE.employee,
        },
    ],
};
