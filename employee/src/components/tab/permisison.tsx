import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TARGET_TEXT } from "@/constants/permission.constant";
import { IPermission } from "@/interface/api/permission.interface";
import { listPermissionApi } from "@/lib/redux/actions/permission.action";
import { permissionSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { ChangeEvent, useEffect, useState } from "react";
import DisplayPermission from "../table/permission";
import { Input } from "../ui/input";

export default function PermissionListTab() {
    const dispatch = useAppDispatch();
    const { permissions, isCalling, isFailure } =
        useAppSelector(permissionSelector);

    const [filterdPermission, SetFilterPermission] = useState<IPermission[]>(
        []
    );

    const reloadData = () => {
        if (!permissions.length) {
            dispatch(listPermissionApi());
        }
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const filteredPermission = permissions.filter((permission) =>
            TARGET_TEXT[permission.target]
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );

        SetFilterPermission(filteredPermission);
    };

    useEffect(() => {
        reloadData();
    }, []);

    useEffect(() => {
        if (!isCalling && !isFailure) {
            SetFilterPermission(permissions);
        }
    }, [isCalling, isFailure]);

    document.title = "Danh sách quyền hạn";

    return (
        <Card>
            <CardHeader>
                <div className="w-[350px]">
                    <Input placeholder="Tìm kiếm" onChange={handleSearch} />
                </div>
            </CardHeader>
            <CardContent>
                <DisplayPermission
                    list={filterdPermission}
                    permissions={filterdPermission}
                />
            </CardContent>
        </Card>
    );
}
