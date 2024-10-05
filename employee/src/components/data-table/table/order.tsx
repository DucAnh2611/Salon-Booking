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
import { IOrderList } from "@/interface/api/order.interface";
import { flexRender, Table as TableType } from "@tanstack/react-table";
import { orderColumnDef } from "../col-def/order";

interface IOrderDataTableProps {
    orders: IOrderList[];
    isCalling: boolean;
    page: number;
    limit: number;
    count: number;
    handlePageUpdate: (page: number) => void;
    table: TableType<IOrderList>;
}

export default function OrderDataTable({
    orders,
    isCalling = true,
    page,
    limit,
    count,
    handlePageUpdate,
    table,
}: IOrderDataTableProps) {
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
                                            className="border w-fit"
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
                                            className="border w-fit"
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
                                    colSpan={orderColumnDef.length}
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
                    {(page - 1) * limit + orders.length} trong tổng số {count}{" "}
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
                            type="number"
                            className="w-[40px] text-center h-full"
                            defaultValue={1}
                            value={page}
                            onChange={(e) => {
                                let newPage = parseInt(e.target.value) || 1;

                                if (newPage < 1) {
                                    newPage = 1;
                                }
                                if (
                                    newPage >= 1 &&
                                    newPage >= Math.ceil(count / limit)
                                ) {
                                    newPage = Math.ceil(count / limit);
                                }
                                e.target.value = newPage.toString();
                                handlePageUpdate(newPage);
                            }}
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
