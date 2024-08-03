import { ACTION_TEXT, TARGET_TEXT } from "@/constants/permission.constant";
import { EAction, ETarget } from "@/enum/permisssion.enum";
import {
    IGroupPermission,
    IPermission,
} from "@/interface/api/permission.interface";
import { CheckIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface IDisplayPermissionProps {
    list: IPermission[];
    permissions: IPermission[];
    canToggle?: boolean;
    onToggle?: (permission: IPermission, select: boolean) => void;
}

export default function DisplayPermission({
    list,
    permissions,
    canToggle = false,
    onToggle,
}: IDisplayPermissionProps) {
    const [groupBasePermissions, SetGroupBasePermissions] = useState<
        IGroupPermission[]
    >([]);
    const [groupListPermissions, SetGroupListPermissions] = useState<
        IGroupPermission[]
    >([]);

    const groupPermission = (list: IPermission[]) => {
        const groupedPermissions = list.reduce(
            (acc: IGroupPermission[], curr: IPermission) => {
                const index = acc.findIndex(
                    (item) => item.target === curr.target
                );
                if (index !== -1) {
                    acc[index].actions.push({
                        id: curr.id,
                        action: curr.action,
                    });
                    acc[index].actions = acc[index].actions.sort((a, b) =>
                        a.action.localeCompare(b.action)
                    );
                } else {
                    const newItem: IGroupPermission = {
                        target: curr.target,
                        actions: [{ id: curr.id, action: curr.action }],
                    };
                    acc.push(newItem);
                }

                return acc;
            },
            []
        );

        return groupedPermissions;
    };

    const isCheck = (target: ETarget, action: EAction) => {
        const getInList = groupListPermissions.find(
            (item) => item.target === target
        );
        if (!getInList) return false;

        return !!getInList.actions.find((act) => act.action === action);
    };

    const handleToggle = (id: string, select: boolean) => () => {
        if (!canToggle || !id) {
            return;
        }
        if (!onToggle) return;

        const findPermissison = permissions.find(
            (permisison) => permisison.id === id
        );
        if (!findPermissison) return;

        onToggle(findPermissison, select);
    };

    useEffect(() => {
        SetGroupBasePermissions(groupPermission(permissions));
        SetGroupListPermissions(groupPermission(list));
    }, [list, permissions]);

    return (
        <div className="relative">
            {groupBasePermissions.length ? (
                <table className="w-full rounded-md relative">
                    <thead className=" sticky top-0 left-0 bg-muted z-10">
                        <tr className="w-full flex">
                            <th className="border flex-1 flex items-center justify-start box-border p-5 py-3 min-w-[300px] max-w-[300px] h-fit overflow-hidden">
                                <p className="w-full text-left text-wrap break-words font-bold">
                                    Tên quyền hạn
                                </p>
                            </th>
                            {Object.values(ACTION_TEXT).map((text) => (
                                <th
                                    key={text}
                                    className="border flex-1 flex items-center justify-center"
                                >
                                    {text}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="w-full relative z-0">
                        {groupBasePermissions.map((permission) => (
                            <tr
                                key={permission.target}
                                className="w-full flex h-fit hover:hover-muted group/row"
                            >
                                <td className="border flex-1 flex items-center justify-start p-5 py-3 min-w-[300px] max-w-[300px] h-fit overflow-hidden group/header box-border group-hover/row:border-primary group-hover/row:border">
                                    <p className="w-full text-left text-wrap break-words font-medium text-muted-foreground group-hover/header:text-foreground">
                                        {TARGET_TEXT[permission.target]}
                                    </p>
                                </td>

                                {Object.values(EAction).map((type) =>
                                    isCheck(permission.target, type) ? (
                                        <td
                                            key={permission.target + type}
                                            className="border hover:bg-green-500 hover:border-green-500 hover:border hover:bg-opacity-10 flex-1 flex items-center justify-center box-border h-auto overflow-hidden"
                                        >
                                            <Button
                                                variant="ghost"
                                                type="button"
                                                className={`w-full h-full p-5 py-3 box-border rounded-none hover:bg-transparent ${
                                                    canToggle
                                                        ? "cursor-pointer"
                                                        : "cursor-default"
                                                }`}
                                                onClick={handleToggle(
                                                    permission.actions.find(
                                                        (act) =>
                                                            act.action === type
                                                    )?.id || "",
                                                    false
                                                )}
                                            >
                                                <CheckIcon
                                                    size={20}
                                                    className="text-green-600"
                                                />
                                            </Button>
                                        </td>
                                    ) : (
                                        <td
                                            key={permission.target + type}
                                            className="border hover:bg-red-500 hover:border-red-500 hover:border hover:bg-opacity-10 flex-1 flex items-center justify-center box-border h-auto overflow-hidden"
                                        >
                                            <Button
                                                variant="ghost"
                                                type="button"
                                                className={`w-full h-full p-5 py-3 box-border rounded-none hover:bg-transparent ${
                                                    canToggle
                                                        ? "cursor-pointer"
                                                        : "cursor-default"
                                                }`}
                                                onClick={handleToggle(
                                                    permission.actions.find(
                                                        (act) =>
                                                            act.action === type
                                                    )?.id || "",
                                                    true
                                                )}
                                            >
                                                <XIcon
                                                    size={20}
                                                    className="text-destructive"
                                                />
                                            </Button>
                                        </td>
                                    )
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Không có bản ghi nào.</p>
            )}
        </div>
    );
}
