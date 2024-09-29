import DeleteEmployeeDialog from "@/components/dialog/employee/delete";
import ResetPasswordEmployeeDialog from "@/components/dialog/employee/reset-password";
import UpdateEmployeeDialog from "@/components/dialog/employee/update";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GENDER_TEXT } from "@/constants/gender.constant";
import { EGender } from "@/enum/gender.enum";
import { IEmployee, IUser } from "@/interface/api/employee.interface";
import { IRole } from "@/interface/api/role.interface";
import { api_media_url } from "@/utils/apiCall";
import { ColumnDef } from "@tanstack/react-table";
import {
    ArrowDownIcon,
    ArrowUpDown,
    ArrowUpIcon,
    ImageOffIcon,
    MoreHorizontal,
} from "lucide-react";

export const employeeColumnDef: ColumnDef<IEmployee>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        size: 10,
    },
    {
        header: "Ảnh",
        accessorKey: "userBase",
        cell: ({ cell }) => {
            const userBase = cell.getValue() as IUser | null;

            return (
                <div className="w-full flex items-center justify-center">
                    {userBase && userBase.userAvatar?.path ? (
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
        header: ({ column }) => {
            const sort = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    className="flex justify-between items-center p-0 hover:bg-transparent"
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                >
                    Tên đăng nhập
                    {sort ? (
                        sort === "asc" ? (
                            <ArrowDownIcon className="ml-2 h-4 w-4" />
                        ) : (
                            <ArrowUpIcon className="ml-2 h-4 w-4" />
                        )
                    ) : (
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                    )}
                </Button>
            );
        },
        accessorKey: "username",
        size: 100,
    },
    {
        header: "Họ tên",
        accessorKey: "userBase",
        cell: ({ cell }) => {
            const userBase = cell.getValue() as IUser;

            return <p>{userBase.firstname + " " + userBase.lastname}</p>;
        },
        size: 100,
    },
    {
        header: "Chức vụ",
        accessorKey: "eRole",
        size: 30,
        cell: ({ cell }) => {
            const role = cell.getValue() as IRole;
            return (
                <Badge variant={role ? "default" : "destructive"}>
                    {role ? role.title : "Đã xóa"}
                </Badge>
            );
        },
    },
    {
        header: "Giới tính",
        accessorKey: "userBase.gender",
        size: 30,
        cell: ({ cell }) => {
            const parseGender: Record<
                EGender,
                { text: string; className: string }
            > = {
                [EGender.M]: {
                    text: GENDER_TEXT[EGender.M],
                    className: "border-blue-500",
                },
                [EGender.F]: {
                    text: GENDER_TEXT[EGender.F],
                    className: "border-pink-500",
                },
                [EGender.OTHER]: {
                    text: GENDER_TEXT[EGender.OTHER],
                    className: "border-primary",
                },
            };
            const gender = cell.getValue() as EGender;
            return (
                <Badge
                    variant="outline"
                    className={parseGender[gender].className}
                >
                    {parseGender[gender].text}
                </Badge>
            );
        },
    },
    {
        header: "Điện thoại",
        accessorKey: "userBase.phone",
        size: 30,
    },
    {
        id: "actions",
        header: "Chức năng",
        cell: ({ row }) => {
            const employee = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="h-8 w-8 p-0">
                            <span className="sr-only">Mở danh sách</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Các chức năng</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="p-0" asChild>
                            <UpdateEmployeeDialog employee={employee} />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0" asChild>
                            <ResetPasswordEmployeeDialog employee={employee} />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0" asChild>
                            <DeleteEmployeeDialog item={employee} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
