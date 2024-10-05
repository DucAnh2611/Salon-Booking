import DeleteOrganizationDialog from "@/components/dialog/organization/delete";
import UpdateOrganizationDialog from "@/components/dialog/organization/update";
import MediaLoader from "@/components/media-load";
import SelectShowOrganization from "@/components/show-organization";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IMedia } from "@/interface/api/media.interface";
import { IOrganization } from "@/interface/api/organization.interface";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

export const organizationColumnDef: ColumnDef<IOrganization>[] = [
    {
        header: "Logo",
        accessorKey: "logo",
        cell: ({ cell }) => {
            const logo = cell.getValue() as IMedia | null;

            return (
                <div className="w-full flex items-center justify-center">
                    <div className="w-[100px] h-[100px]">
                        <MediaLoader media={logo} />
                    </div>
                </div>
            );
        },
    },
    {
        header: "Tên",
        accessorKey: "name",
    },
    {
        header: "Địa chỉ",
        cell: ({ row }) => {
            const organization = row.original;

            return (
                <p className="w-full max-w-[150px] line-clamp-1 text-ellipsis ">
                    {organization.address}
                </p>
            );
        },
    },
    {
        header: "Số điện thoại",
        accessorKey: "phone",
    },
    {
        header: "Facebook",
        cell: ({ row }) => {
            const organization = row.original;

            if (!organization.facebook)
                return <p className="text-muted-foreground text-sm">Không</p>;

            return (
                <a
                    target="_blank"
                    href={organization.facebook}
                    rel="noreferrer"
                    className="max-w-[120px] text-sm hover:underline hover:text-primary  whitespace-nowrap line-clamp-1 text-ellipsis "
                >
                    {organization.facebook}
                </a>
            );
        },
    },
    {
        header: "Zalo",
        cell: ({ row }) => {
            const organization = row.original;

            if (!organization.zalo)
                return <p className="text-muted-foreground text-sm">Không</p>;

            return (
                <a
                    target="_blank"
                    href={organization.zalo}
                    rel="noreferrer"
                    className="max-w-[120px] text-sm hover:underline hover:text-primary  whitespace-nowrap line-clamp-1 text-ellipsis "
                >
                    {organization.zalo}
                </a>
            );
        },
    },
    {
        header: "Instagram",
        cell: ({ row }) => {
            const organization = row.original;

            if (!organization.instagram)
                return <p className="text-muted-foreground text-sm">Không</p>;

            return (
                <a
                    target="_blank"
                    href={organization.instagram}
                    rel="noreferrer"
                    className="max-w-[120px] text-sm hover:underline hover:text-primary  whitespace-nowrap line-clamp-1 text-ellipsis "
                >
                    {organization.instagram}
                </a>
            );
        },
    },
    {
        header: "Hoạt động",
        cell: ({ row }) => {
            const organization = row.original;

            return (
                <div>
                    <SelectShowOrganization organization={organization} />
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Chức năng",
        cell: ({ row }) => {
            const item = row.original;
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
                            <UpdateOrganizationDialog item={item} />
                        </DropdownMenuItem>
                        <DropdownMenuItem className="p-0" asChild>
                            <DeleteOrganizationDialog item={item} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
