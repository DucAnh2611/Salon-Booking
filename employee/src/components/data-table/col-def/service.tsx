import DeleteServiceDialog from "@/components/dialog/service/delete";
import UpdateServiceDialog from "@/components/dialog/service/update";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IService, IServiceMedia } from "@/interface/api/service.interface";
import { api_media_url } from "@/utils/apiCall";
import { getMediaType } from "@/utils/media-checker.util";
import { formatMoney } from "@/utils/money";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
    ArrowDownIcon,
    ArrowUpDown,
    ArrowUpIcon,
    ImageOffIcon,
    MoreHorizontal,
} from "lucide-react";

export const serviceColumnDef: ColumnDef<IService>[] = [
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
        header: "Ảnh bìa",
        accessorKey: "media",
        cell: ({ cell }) => {
            const medias = cell.getValue() as IServiceMedia[];

            const thumbnail = medias.find((m) => m.isThumbnail && m.media);

            return (
                <div className="w-full flex items-center justify-center">
                    {thumbnail ? (
                        getMediaType(thumbnail.media.path) === "image" ? (
                            <img
                                src={api_media_url + thumbnail.media.path}
                                alt="product"
                                className="h-[70px] aspect-square object-cover rounded-md overflow-hidden"
                            />
                        ) : (
                            <video
                                src={api_media_url + thumbnail.media.path}
                                className="h-[70px] aspect-square object-cover rounded-md overflow-hidden"
                            />
                        )
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
                    Tên
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
        accessorKey: "name",
        size: 100,
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
                    Giá (vnđ)
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
        accessorKey: "price",
        cell: ({ row }) => {
            return <p>{formatMoney(row.original.price)}</p>;
        },
        size: 100,
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
                    Thời gian (phút)
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
        accessorKey: "duration",
        size: 100,
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

            return <p>{format(time, "yyyy/MM/dd HH:mm:ss")}</p>;
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

            return <p>{format(time, "yyyy/MM/dd HH:mm:ss")}</p>;
        },
    },
    {
        id: "actions",
        header: "Chức năng",
        cell: ({ row }) => {
            const service = row.original;
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
                            <UpdateServiceDialog service={service} />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0" asChild>
                            <DeleteServiceDialog service={service} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
