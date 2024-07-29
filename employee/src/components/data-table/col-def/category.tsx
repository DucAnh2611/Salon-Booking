import DeleteCategoryDialog from "@/components/dialog/category/delete";
import UpdateCategoryDialog from "@/components/dialog/category/update";
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
import { ICategory } from "@/interface/api/category.interface";
import { IMedia } from "@/interface/api/media.interface";
import { api_media_url } from "@/utils/apiCall";
import { ColumnDef } from "@tanstack/react-table";
import {
    ArrowDownIcon,
    ArrowUpDown,
    ArrowUpIcon,
    ImageOffIcon,
    MoreHorizontal,
} from "lucide-react";

export const categoryColumnDef: ColumnDef<ICategory>[] = [
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
        accessorKey: "image",
        cell: ({ cell }) => {
            const image = cell.getValue() as IMedia | null;

            return (
                <div className="w-full flex items-center justify-center">
                    {image ? (
                        <img
                            src={api_media_url + image.path}
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
                    Tiêu đề
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
        accessorKey: "title",
        size: 100,
    },
    {
        header: "Danh mục cha",
        accessorKey: "parent",
        size: 30,
        cell: ({ row }) => {
            const parent = row.getValue("parent") as ICategory | null;
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
        id: "actions",
        header: "Chức năng",
        cell: ({ row }) => {
            const category = row.original;
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
                            <UpdateCategoryDialog item={category} />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0" asChild>
                            <DeleteCategoryDialog item={category} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
