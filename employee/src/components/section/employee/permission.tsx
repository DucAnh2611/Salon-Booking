import DisplayPermission from "@/components/table/permission";
import { API_URLS } from "@/constants/api.constant";
import { IRoleDetail, IRolePermission } from "@/interface/api/role.interface";
import { listPermissionApi } from "@/lib/redux/actions/permission.action";
import { permissionSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { apiCall } from "@/utils/apiCall";
import { useEffect, useState } from "react";

interface IPermissionEmployeeSection {
    eRoleId: string;
}
export default function PermissionEmployeeSection({
    eRoleId,
}: IPermissionEmployeeSection) {
    const dispatch = useAppDispatch();
    const { permissions } = useAppSelector(permissionSelector);
    const [role, SetRole] = useState<IRoleDetail | undefined>();

    const getPermissions = () => {
        dispatch(listPermissionApi());
    };

    const getRole = async (id: string) => {
        const api = API_URLS.ROLE.DETAIL(id);
        const { response } = await apiCall<IRoleDetail>({ ...api });

        if (response) {
            SetRole(response.result);
        }
    };

    const getListPermission = (list: IRolePermission[]) => {
        return list.map((rp) => rp.permission);
    };

    useEffect(() => {
        if (!role) {
            getRole(eRoleId);
        } else if (role.id !== eRoleId) {
            getRole(eRoleId);
        }

        if (!permissions.length) {
            getPermissions();
        }
    }, [eRoleId]);

    if (!role) return <></>;

    return (
        <div>
            <DisplayPermission
                list={getListPermission(role.rolePermission)}
                permissions={permissions}
                canToggle={false}
            />
        </div>
    );
}
