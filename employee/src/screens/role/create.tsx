import PopoverSelectParentRole from "@/components/popover/role/select-parent";
import RequireField from "@/components/require-field";
import DisplayPermission from "@/components/table/permission";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ROUTER_PATH } from "@/constants/router.constant";
import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { IPermission } from "@/interface/api/permission.interface";
import { IRole, IRoleCreate } from "@/interface/api/role.interface";
import { listPermissionApi } from "@/lib/redux/actions/permission.action";
import { createRoleApi } from "@/lib/redux/actions/role.action";
import { permissionSelector, roleSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { LoaderCircleIcon, Undo2Icon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateRoleScreen() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { isCreating, isFailure } = useAppSelector(roleSelector);
    const { permissions } = useAppSelector(permissionSelector);

    const [tempPermission, SetTempPermission] = useState<IPermission[]>([]);
    const [newRole, SetNewRole] = useState<IRoleCreate>({
        description: "",
        parentId: "",
        title: "",
        parent: null,
    });
    const [submit, SetSubmit] = useState<boolean>(false);
    const [error, SetError] = useState<
        Array<{ field: string; message: string }>
    >([]);

    const handleLoadPermission = () => {
        dispatch(listPermissionApi());
    };

    const handleBack = () => {
        navigate(`${ROUTER_PATH.ROLE}`);
    };

    const handleSelectParent = (item: IRole | null) => {
        error.length && SetError([]);
        SetNewRole({
            ...newRole,
            parentId: item?.id,
            parent: item || null,
        });
    };

    const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        error.length && SetError([]);
        SetNewRole({
            ...newRole,
            title: e.target.value,
        });
    };

    const handleChangeDesc = (e: ChangeEvent<HTMLTextAreaElement>) => {
        error.length && SetError([]);
        SetNewRole({
            ...newRole,
            description: e.target.value,
        });
    };

    const setDefaultTemp = () => {
        SetNewRole({
            description: "",
            parentId: "",
            title: "",
            parent: null,
        });
        SetTempPermission([]);
    };

    const toggleUpdatePermission = (
        permission: IPermission,
        select: boolean
    ) => {
        if (select) {
            SetTempPermission((perms) => [...perms, permission]);
        } else {
            SetTempPermission((perms) =>
                perms.filter((p) => p.id !== permission.id)
            );
        }
    };

    const submitUpdate = () => {
        const error = [];
        if (!newRole.title) {
            error.push({
                field: "title",
                message: ZOD_MESSAGE.min(2, "Tến chức vụ"),
            });
        } else if (newRole.title.length > 50) {
            error.push({
                field: "title",
                message: ZOD_MESSAGE.max(50, "Tến chức vụ"),
            });
        }

        if (error.length) {
            SetError(error);
            return;
        }

        SetSubmit(true);
        dispatch(
            createRoleApi({
                description: newRole.description,
                title: newRole.title,
                permissionIds: tempPermission.map((per) => per.id),
                ...(newRole.parentId ? { parentId: newRole.parentId } : {}),
                parent: null,
            })
        );
    };

    useEffect(() => {
        if (!isFailure && !isCreating && submit) {
            toast({
                title: "Tạo mới thành công",
                description: "Tạo mới một chức vụ thành công",
            });
            SetSubmit(false);
            setDefaultTemp();
        }
    }, [isFailure, isCreating, submit]);

    useEffect(() => {
        setDefaultTemp();
        if (!permissions.length) {
            handleLoadPermission();
        }
    }, []);

    return (
        <div className="flex flex-col w-full h-fit gap-5">
            <Card>
                <CardHeader>
                    <div className="flex w-full justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <CardTitle>Thông tin chi tiết</CardTitle>
                            <CardDescription>
                                Một số thông tin cơ bản về tên, danh mục cha,
                                v.v
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="gap-1"
                                onClick={handleBack}
                            >
                                <Undo2Icon size={15} />
                                Quay lại danh sách
                            </Button>

                            <Button
                                className="gap-1"
                                onClick={submitUpdate}
                                disabled={isCreating}
                            >
                                {isCreating && (
                                    <LoaderCircleIcon
                                        size={15}
                                        className="animate-spin"
                                    />
                                )}
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="w-full grid grid-cols-2 gap-2">
                        <div>
                            <Label>
                                Tên chức vụ
                                <RequireField />
                            </Label>
                            <Input
                                placeholder="Tên chức vụ"
                                value={newRole.title}
                                onChange={handleChangeTitle}
                            />
                            {error.some((e) => e.field === "title") && (
                                <p className="text-destructive text-xs mt-1">
                                    {
                                        error.find((e) => e.field === "title")
                                            ?.message
                                    }
                                </p>
                            )}
                        </div>
                        <div>
                            <Label>Chức vụ cha</Label>
                            <PopoverSelectParentRole
                                selected={newRole.parent}
                                onSelectParent={handleSelectParent}
                            />
                        </div>
                        <div>
                            <Label>Mô tả</Label>
                            <Textarea
                                className="h-[120px] resize-none"
                                maxLength={150}
                                placeholder="Mô tả về chức vụ"
                                value={newRole.description}
                                onChange={handleChangeDesc}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin quyền hạn</CardTitle>
                    <CardDescription>
                        Quyền hạn truy cập tài nguyên của chức vụ.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <DisplayPermission
                        list={tempPermission}
                        permissions={permissions}
                        canToggle
                        onToggle={toggleUpdatePermission}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default CreateRoleScreen;
