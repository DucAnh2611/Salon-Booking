import DeleteRoleDialog from "@/components/dialog/role/delete";
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
import UpdateHistory from "@/components/update-history";
import { ROUTER_PATH } from "@/constants/router.constant";
import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { IPermission } from "@/interface/api/permission.interface";
import {
    IRole,
    IRoleDetail,
    IRolePermission,
} from "@/interface/api/role.interface";
import { listPermissionApi } from "@/lib/redux/actions/permission.action";
import { detailRoleApi, updateRoleApi } from "@/lib/redux/actions/role.action";
import { permissionSelector, roleSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
    LoaderCircleIcon,
    PencilLineIcon,
    Trash2Icon,
    Undo2Icon,
    XIcon,
} from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function UpdateRoleScreen() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { id } = useParams();
    const { detail, isUpdating, isFailure } = useAppSelector(roleSelector);
    const { permissions } = useAppSelector(permissionSelector);

    const [tempPermission, SetTempPermission] = useState<IPermission[]>([]);
    const [tempUpdate, SetTempUpdate] = useState<IRoleDetail | null>(null);
    const [update, SetUpdate] = useState<boolean>(false);
    const [error, SetError] = useState<
        Array<{ field: string; message: string }>
    >([]);

    const handleLoadDetail = (id: string) => {
        dispatch(detailRoleApi(id));
    };

    const handleLoadPermission = () => {
        dispatch(listPermissionApi());
    };

    const getListPermission = (list: IRolePermission[]) => {
        return list.map((rp) => rp.permission);
    };

    const handleBack = () => {
        navigate(`${ROUTER_PATH.ROLE}`);
    };

    const handleSelectParent = (item: IRole | null) => {
        error.length && SetError([]);
        SetTempUpdate(
            tempUpdate
                ? {
                      ...tempUpdate,
                      parentId: item?.id || null,
                      parent: item || null,
                  }
                : null
        );
    };

    const handleChangeTitle = (e: ChangeEvent<HTMLInputElement>) => {
        error.length && SetError([]);
        SetTempUpdate(
            tempUpdate
                ? {
                      ...tempUpdate,
                      title: e.target.value,
                  }
                : null
        );
    };

    const handleChangeDesc = (e: ChangeEvent<HTMLTextAreaElement>) => {
        error.length && SetError([]);
        SetTempUpdate(
            tempUpdate
                ? {
                      ...tempUpdate,
                      description: e.target.value,
                  }
                : null
        );
    };

    const setDefaultTemp = () => {
        if (detail) {
            SetTempUpdate(detail);
            SetTempPermission(getListPermission(detail.rolePermission));
        }
    };

    const toggleUpdateForm = () => {
        if (!detail?.deletable) {
            return;
        }
        const lastUpdate = update;
        if (lastUpdate) {
            SetError([]);
            setDefaultTemp();
        }
        SetUpdate(!lastUpdate);
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
        if (tempUpdate) {
            const error = [];
            if (!tempUpdate.title) {
                error.push({
                    field: "title",
                    message: ZOD_MESSAGE.min(2, "Tến chức vụ"),
                });
            } else if (tempUpdate.title.length > 50) {
                error.push({
                    field: "title",
                    message: ZOD_MESSAGE.max(50, "Tến chức vụ"),
                });
            }

            if (error.length) {
                SetError(error);
                return;
            }

            dispatch(
                updateRoleApi(tempUpdate.id, {
                    ...(tempUpdate.parentId
                        ? { parentId: tempUpdate.parentId }
                        : {}),
                    title: tempUpdate.title,
                    permissionIds: tempPermission.map((per) => per.id),
                    description: tempUpdate.description || "",
                })
            );
        }
    };

    useEffect(() => {
        if (id) {
            if (!permissions.length) {
                handleLoadPermission();
            }
            handleLoadDetail(id);
        }
    }, [id]);

    useEffect(() => {
        if (!isFailure && !isUpdating && id) {
            handleLoadDetail(id);
            SetUpdate(false);
        }
    }, [isFailure, isUpdating]);

    useEffect(() => {
        setDefaultTemp();
    }, [detail]);

    if (!detail || !tempUpdate) {
        return (
            <div className="w-full h-full border-dashed rounded-md flex items-center justify-center">
                <p>Không tìm thấy chức vụ yêu cầu.</p>
            </div>
        );
    }

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

                            {detail && (
                                <DeleteRoleDialog
                                    item={detail}
                                    trigger={
                                        <Button
                                            className="gap-2 items-center"
                                            variant="destructive"
                                            disabled={!detail.deletable}
                                        >
                                            <Trash2Icon size={15} /> Xóa
                                        </Button>
                                    }
                                />
                            )}

                            {update ? (
                                <>
                                    <Button
                                        variant="destructive"
                                        className="gap-1"
                                        onClick={toggleUpdateForm}
                                    >
                                        <XIcon size={15} />
                                        Bỏ thay đổi
                                    </Button>

                                    <Button
                                        className="gap-1"
                                        onClick={submitUpdate}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating && (
                                            <LoaderCircleIcon
                                                size={15}
                                                className="animate-spin"
                                            />
                                        )}
                                        Xác nhận
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="default"
                                    className="gap-1"
                                    disabled={!detail.deletable}
                                    onClick={toggleUpdateForm}
                                >
                                    <PencilLineIcon size={15} />
                                    Cập nhật
                                </Button>
                            )}
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
                                disabled={!update}
                                placeholder="Tên chức vụ"
                                value={tempUpdate.title}
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
                            <Label>Chức vụ</Label>
                            <PopoverSelectParentRole
                                disabled={!update}
                                selected={tempUpdate.parent}
                                onSelectParent={handleSelectParent}
                            />
                        </div>
                        <div>
                            <Label>Ngày tạo</Label>
                            <Input
                                disabled
                                placeholder="Ngày tạo"
                                value={new Date(
                                    tempUpdate.createdAt
                                ).toLocaleString()}
                            />
                        </div>
                        <div>
                            <Label>Ngày cập nhật</Label>
                            <Input
                                disabled
                                placeholder="Ngày cập nhật"
                                value={new Date(
                                    tempUpdate.updatedAt
                                ).toLocaleString()}
                            />
                        </div>
                        <div>
                            <Label>Mô tả</Label>
                            <Textarea
                                className="h-[120px] resize-none"
                                placeholder="Mô tả chức vụ"
                                disabled={!update}
                                maxLength={150}
                                value={tempUpdate.description}
                                onChange={handleChangeDesc}
                            />
                        </div>
                    </div>
                    <div className="w-full mt-5">
                        <UpdateHistory
                            userCreate={tempUpdate.userCreate}
                            userUpdate={tempUpdate.userUpdate}
                            updatedAt={tempUpdate.updatedAt}
                            createdAt={tempUpdate.createdAt}
                        />
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
                        canToggle={update}
                        onToggle={toggleUpdatePermission}
                    />
                </CardContent>
            </Card>
        </div>
    );
}

export default UpdateRoleScreen;
