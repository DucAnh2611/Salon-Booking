import DeleteProductDialog from "@/components/dialog/product/delete";
import UpdateProductDialog from "@/components/dialog/product/update";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IProduct, IProductMedia } from "@/interface/api/product.interface";
import { api_media_url } from "@/utils/apiCall";
import { getMediaType } from "@/utils/media-checker.util";
import { ColumnDef } from "@tanstack/react-table";
import {
    ArrowDownIcon,
    ArrowUpDown,
    ArrowUpIcon,
    ImageOffIcon,
    MoreHorizontal,
} from "lucide-react";

export const productColumnDef: ColumnDef<IProduct>[] = [
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
        accessorKey: "productMedia",
        cell: ({ cell }) => {
            const medias = cell.getValue() as IProductMedia[];

            return (
                <div className="w-full flex items-center justify-center">
                    {medias.length ? (
                        getMediaType(
                            medias.filter((m) => m.isThumbnail)[0].media.path
                        ) === "image" ? (
                            <img
                                src={
                                    api_media_url +
                                    medias.filter((m) => m.isThumbnail)[0].media
                                        .path
                                }
                                alt="product"
                                className="h-[70px] aspect-square object-cover rounded-md overflow-hidden"
                            />
                        ) : (
                            <video
                                src={
                                    api_media_url +
                                    medias.filter((m) => m.isThumbnail)[0].media
                                        .path
                                }
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
                    Thương hiệu
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
        accessorKey: "brand",
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
                    Giá
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
                    Số lượng
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
        accessorKey: "quantity",
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
            const product = row.original;
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
                            <UpdateProductDialog product={product} />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0" asChild>
                            <DeleteProductDialog product={product} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
