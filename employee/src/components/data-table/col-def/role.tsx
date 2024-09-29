import DeleteRoleDialog from "@/components/dialog/role/delete";
import UpdateRoleDialog from "@/components/dialog/role/update";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IRole } from "@/interface/api/role.interface";
import { ColumnDef } from "@tanstack/react-table";
import {
    ArrowDownIcon,
    ArrowUpDown,
    ArrowUpIcon,
    MoreHorizontal,
    Trash2Icon,
} from "lucide-react";

export const roleColumnDef: ColumnDef<IRole>[] = [
    {
        id: "select",
        header: ({ table }) => {
            return (
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
            );
        },
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
        id: "title",
        accessorKey: "title",
        header: "Tên chức vụ",
    },
    {
        header: "Chức vụ cha",
        accessorKey: "parent",
        cell: ({ row }) => {
            const parent = row.getValue("parent") as IRole | null;
            const category = row.original;
            return (
                <Badge
                    variant={
                        parent
                            ? "default"
                            : category.parentId
                            ? "destructive"
                            : "outline"
                    }
                >
                    {parent
                        ? parent.title
                        : category.parentId
                        ? "Đã bị xóa"
                        : "Không"}
                </Badge>
            );
        },
        size: 30,
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
                    Thời gian tạo
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
        accessorKey: "createdAt",
        cell: ({ row }) => {
            const time = new Date(row.getValue("createdAt"));

            return <p>{time.toLocaleString()}</p>;
        },
    },
    {
        header: ({ column }) => {
            const sort = column.getIsSorted();
            return (
                <Button
                    variant="ghost"
                    className="flex justify-between items-center p-0 hover:bg-transparent"
                    onClick={() => {
                        column.toggleSorting(sort === "asc");
                    }}
                >
                    Thời gian cập nhật
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
        accessorKey: "updatedAt",
        cell: ({ row }) => {
            const time = new Date(row.getValue("updatedAt"));

            return <p>{time.toLocaleString()}</p>;
        },
    },
    {
        header: "Có thể xóa",
        accessorKey: "deletable",
        cell: ({ row }) => {
            const role = row.original;
            return (
                <Badge
                    variant="outline"
                    className={`${
                        role.deletable
                            ? "border-green-300 text-green-500 hover:bg-green-50"
                            : "border-red-300 text-destructive hover:bg-red-50"
                    }`}
                >
                    {role.deletable ? "Có" : "Không"}
                </Badge>
            );
        },
    },
    {
        id: "actions",
        header: "Chức năng",
        cell: ({ row }) => {
            const role = row.original;
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
                        <DropdownMenuItem className="p-0" asChild>
                            <UpdateRoleDialog role={role} />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0" asChild>
                            <DeleteRoleDialog
                                item={role}
                                trigger={
                                    <Button
                                        className="gap-2 items-center w-full text-destructive justify-start py-1 px-2"
                                        variant="ghost"
                                        disabled={!role.deletable}
                                    >
                                        <Trash2Icon size={15} /> Xóa
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
