import { ROLE_TITLE } from '../../../../common/constant/role.constant';
import { GenderEnum } from '../../../../common/enum/gender.enum';
import { PermissionActionEnum, PermissionTargetEnum } from '../../../../common/enum/permission.enum';
import { UserTypeEnum } from '../../../../common/enum/user.enum';
import { CreatePermissionDto } from '../../../permission/dto/create-permission.dto';
import { TSeedData, TSeedRolePermisison } from '../type/seed.type';

export const SEED_DATA: TSeedData = {
    employee: [
        {
            birthday: new Date(),
            gender: GenderEnum.MALE,
            phone: '0987654321',
            password: '1',
            firstname: 'Duc',
            lastname: 'Anh',
            username: 'admin1',
            type: UserTypeEnum.STAFF,
            role: ROLE_TITLE.admin,
        },
    ],
    role: [
        {
            title: ROLE_TITLE.admin,
            parent: null,
            deletable: false,
        },
    ],
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
    ],
};
