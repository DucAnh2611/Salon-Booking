import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { IOrganization } from "@/interface/api/organization.interface";
import { organizationSelector } from "@/lib/redux/selector";
import { useAppSelector } from "@/lib/redux/store";
import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { categoryColumnDef } from "../col-def/category";
import { organizationColumnDef } from "../col-def/organization";

interface IOrganizationDataTableProps {
    count: number;
    page: number;
    limit: number;
    items: IOrganization[];
    handlePageUpdate: (page: number) => void;
}

export default function OrganizationDataTable({
    count,
    page,
    limit,
    items,
    handlePageUpdate,
}: IOrganizationDataTableProps) {
    const { isCalling, isDeleting, isFailure } =
        useAppSelector(organizationSelector);

    const table = useReactTable<IOrganization>({
        data: items,
        columns: organizationColumnDef,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div>
            <div className="rounded-md">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className="border"
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="relative">
                        {isCalling && (
                            <div className="w-full h-full absolute bg-black bg-opacity-50 flex items-center justify-center top-0 left-0">
                                <p className="text-muted text-2xl">Đang tải</p>
                            </div>
                        )}
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            className="border"
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={categoryColumnDef.length}
                                    className="h-24 text-center border"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end pt-3">
                <div className="flex-1 text-sm text-muted-foreground">
                    Bản ghi từ {(page - 1) * limit + 1} tới{" "}
                    {(page - 1) * limit + items.length} trong tổng số {count}{" "}
                    bản ghi{" "}
                </div>
                <div className="flex justify-start gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageUpdate(page - 1)}
                        disabled={page === 1}
                    >
                        Trang trước
                    </Button>
                    <div className="flex gap-1 items-center">
                        <Input
                            value={page}
                            type="number"
                            className="w-[40px] text-center h-full"
                            onChange={(e) =>
                                handlePageUpdate(parseInt(e.target.value))
                            }
                        />
                        <p className="text-sm text-muted-foreground">
                            / {Math.ceil(count / limit)}
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageUpdate(page + 1)}
                        disabled={page >= Math.ceil(count / limit)}
                    >
                        Trang sau
                    </Button>
                </div>
            </div>
        </div>
    );
}
