import { orderColumnDef } from "@/components/data-table/col-def/order";
import OrderDataTable from "@/components/data-table/table/order";
import SheetFilterOrderProduct from "@/components/sheet-order-product-filter";
import SheetSortOrderProduct from "@/components/sheet-sort-product-order";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import usePagination from "@/hooks/usePagination";
import {
    IApiOrderListFilter,
    IApiOrderListSort,
    IOrderList,
} from "@/interface/api/order.interface";
import { listOrder } from "@/lib/redux/actions/order.action";
import { orderSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { isSameObject } from "@/utils/object";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table";
import { RefreshCwIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

function OrderScreen() {
    const dispatch = useAppDispatch();
    const {
        isCalling,
        orders,
        count,
        page: pageState,
        filter: filterState,
        sort: sortState,
        limit: limitState,
    } = useAppSelector(orderSelector);

    const { SetPage, limit, page } = usePagination({
        defLimit: limitState,
        defPage: pageState,
    });
    const [filter, SetFilter] = useState<IApiOrderListFilter>(filterState);
    const [sort, SetSort] = useState<IApiOrderListSort>(sortState);
    const [code, SetCode] = useDebounce<string>("");
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
        {}
    );

    const handleReload = (
        filter: IApiOrderListFilter,
        order: IApiOrderListSort,
        page: number,
        limit: number
    ) => {
        dispatch(listOrder({ filter, order, page, limit }));
    };

    const handleChangeCode = (e: ChangeEvent<HTMLInputElement>) => {
        SetCode(e.target.value);
    };

    const handleClickReload = () => {
        handleReload(filter, sort, page, limit);
    };

    const handleChangeFilter = (newFilter: IApiOrderListFilter) => {
        if (!isSameObject(filter, newFilter)) {
            SetPage(1);
        }
        SetFilter(newFilter);
    };

    const handleChangeSort = (sort: IApiOrderListSort) => {
        SetSort(sort);
    };

    const handlePageUpdate = (page: number) => {
        SetPage(page);
    };

    const table = useReactTable<IOrderList>({
        columns: orderColumnDef,
        data: orders,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            columnVisibility,
        },
    });

    useEffect(() => {
        handleReload(filter, sort, page, limit);
    }, [filter, sort, page, limit]);

    useEffect(() => {
        SetFilter((f) => ({ ...f, code: code }));
    }, [code]);

    document.title = "Đơn hàng";

    return (
        <Card>
            <CardHeader>
                <div className="w-full h-full flex justify-between gap-4">
                    <div className="flex gap-2">
                        <div className="w-[350px]">
                            <Input
                                placeholder="Mã đơn hàng"
                                onChange={handleChangeCode}
                                className="focus-visible:ring-transparent"
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="ml-auto">
                                    Hiển thị
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {table
                                    .getAllColumns()
                                    .filter((column) => column.getCanHide())
                                    .map((column) => {
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={column.id}
                                                className="capitalize"
                                                checked={column.getIsVisible()}
                                                onCheckedChange={(value) =>
                                                    column.toggleVisibility(
                                                        !!value
                                                    )
                                                }
                                            >
                                                {column.id}
                                            </DropdownMenuCheckboxItem>
                                        );
                                    })}
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <SheetFilterOrderProduct
                            filter={filter}
                            onConfirm={handleChangeFilter}
                        />
                        <SheetSortOrderProduct
                            sort={sort}
                            onConfirm={handleChangeSort}
                        />
                    </div>
                    <div className="w-fit flex gap-2">
                        <Button
                            onClick={handleClickReload}
                            variant="outline"
                            className="gap-1"
                            disabled={isCalling}
                        >
                            <RefreshCwIcon
                                size={14}
                                className={`${isCalling ? "animate-spin" : ""}`}
                            />
                            <p className="font-normal">
                                {isCalling ? "Đang tải" : "Tải lại"}
                            </p>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <OrderDataTable
                    count={count}
                    orders={orders}
                    limit={limit}
                    page={page}
                    isCalling={isCalling}
                    handlePageUpdate={handlePageUpdate}
                    table={table}
                />
            </CardContent>
        </Card>
    );
}

export default OrderScreen;
