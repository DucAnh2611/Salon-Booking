import DialogUpdateLockClient from "@/components/dialog/client/update-state-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IClientList } from "@/interface/api/client.interface";
import { IUser } from "@/interface/api/employee.interface";
import { cn } from "@/lib";
import { api_media_url } from "@/utils/apiCall";
import { joinString } from "@/utils/string";
import { ColumnDef } from "@tanstack/react-table";
import { Ellipsis, ImageOffIcon } from "lucide-react";

export const clientColumnDef: ColumnDef<IClientList>[] = [
    {
        header: "Ảnh",
        accessorKey: "userBase",
        cell: ({ cell }) => {
            const userBase = cell.getValue() as IUser | null;

            return (
                <div className="w-full flex items-center justify-center">
                    {userBase &&
                    userBase.userAvatar &&
                    userBase.userAvatar.path ? (
                        <img
                            src={api_media_url + userBase.userAvatar.path}
                            alt="category"
                            className="h-[70px] aspect-square object-cover rounded-md overflow-hidden"
                        />
                    ) : (
                        <div className="h-[70px] aspect-square bg-muted flex items-center justify-center text-muted-foreground">
                            <ImageOffIcon size={15} />
                        </div>
                    )}
                </div>
            );
        },
        minSize: 80,
        maxSize: 80,
    },
    {
        id: "email",
        accessorKey: "email",
        header: "Email",
    },
    {
        id: "emailVer",
        header: "Xác thực email",
        cell: ({ row }) => {
            const client = row.original;

            return (
                <Badge
                    variant={"outline"}
                    className={cn(
                        client.emailVerified
                            ? "text-green-500 border-green-500"
                            : "text-red-500 border-red-500"
                    )}
                >
                    {client.emailVerified ? "Đã xác thực" : "Chưa"}
                </Badge>
            );
        },
    },
    {
        id: "phone",
        cell: ({ row }) => {
            const client = row.original;

            return <p>{client.userBase.phone}</p>;
        },
        header: "SĐT",
    },
    {
        id: "name",
        header: "Tên",
        cell: ({ row }) => {
            const client = row.original;

            return (
                <p>
                    {joinString({
                        joinString: " ",
                        strings: [
                            client.userBase.lastname,
                            client.userBase.firstname,
                        ],
                    })}
                </p>
            );
        },
    },
    {
        id: "lockAccount",
        header: "Tài khoản",
        cell: ({ row }) => {
            const client = row.original;

            return (
                <Badge
                    variant={"outline"}
                    className={cn(
                        !client.lockAccount
                            ? "text-green-500 border-green-500"
                            : "text-red-500 border-red-500"
                    )}
                >
                    {client.lockAccount ? "Khóa" : "Khả dụng"}
                </Badge>
            );
        },
    },
    {
        id: "lockOrder",
        header: "Đặt đơn",
        cell: ({ row }) => {
            const client = row.original;

            return (
                <Badge
                    variant={"outline"}
                    className={cn(
                        !client.lockOrder
                            ? "text-green-500 border-green-500"
                            : "text-red-500 border-red-500"
                    )}
                >
                    {client.lockOrder ? "Khóa" : "Khả dụng"}
                </Badge>
            );
        },
    },
    {
        id: "action",
        header: "Hành động",
        cell: ({ row }) => {
            const client = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="" size="icon" variant="outline">
                            <Ellipsis size={15} />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end">
                        <DropdownMenuItem asChild>
                            <DialogUpdateLockClient
                                client={client}
                                trigger={
                                    <Button
                                        className="w-full p-2"
                                        variant="ghost"
                                    >
                                        Cập nhật trạng thái
                                    </Button>
                                }
                            />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
