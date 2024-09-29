import { clientColumnDef } from "@/components/data-table/col-def/client";
import ClientDataTable from "@/components/data-table/table/client";
import SheetFilterClient from "@/components/sheet-client-filter";
import SheetSortClient from "@/components/sheet-client-sort";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import usePagination from "@/hooks/usePagination";
import {
    IApiClientList,
    IClientList,
    IFilterClientList,
    IOrderClientList,
} from "@/interface/api/client.interface";
import { clientList } from "@/lib/redux/actions/client.action";
import { clientSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { isSameObject } from "@/utils/object";
import {
    getCoreRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ClientScreen() {
    const {
        page: pageState,
        limit: limitState,
        count,
        clients,
        order: sortState,
        reload,
        filter: filterState,
        isCalling,
    } = useAppSelector(clientSelector);
    const dispatch = useAppDispatch();

    const { SetPage, limit, page } = usePagination({
        defLimit: limitState,
        defPage: pageState,
    });
    const [filter, SetFilter] = useState<IFilterClientList>(filterState);
    const [sort, SetSort] = useState<IOrderClientList>(sortState);

    const table = useReactTable<IClientList>({
        columns: clientColumnDef,
        data: clients,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleReload = () => {
        getClientList({
            page,
            limit,
            filter,
            order: sort,
        });
    };

    const getClientList = (body: IApiClientList) => {
        dispatch(clientList(body));
    };

    const handleChangeFilter = (newFilter: IFilterClientList) => {
        if (!isSameObject(filter, newFilter)) {
            SetPage(1);
        }
        SetFilter(newFilter);
    };

    const handleChangeSort = (sort: IOrderClientList) => {
        SetSort(sort);
    };

    const handlePageUpdate = (page: number) => {
        SetPage(page);
    };

    useEffect(() => {
        getClientList({ filter, order: sort, page, limit });
    }, [filter, sort, page, limit]);

    useEffect(() => {
        handleReload();
    }, [reload]);

    return (
        <Card>
            <CardHeader>
                <div className="w-full h-full flex justify-between gap-4">
                    <div className="flex gap-2">
                        <SheetFilterClient
                            filter={filter}
                            onConfirm={handleChangeFilter}
                        />
                        <SheetSortClient
                            sort={sort}
                            onConfirm={handleChangeSort}
                        />
                    </div>
                    <div className="w-fit flex gap-2">
                        <Button
                            onClick={handleReload}
                            variant="outline"
                            className="gap-1"
                            disabled={isCalling}
                        >
                            <RefreshCwIcon
                                size={14}
                                className={`${isCalling ? "animate-spin" : ""}`}
                            />
                            <p className="font-normal">
                                {false ? "Đang tải" : "Tải lại"}
                            </p>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ClientDataTable
                    page={page}
                    limit={limit}
                    clients={clients}
                    count={count}
                    isCalling={isCalling}
                    handlePageUpdate={handlePageUpdate}
                    table={table}
                />
            </CardContent>
        </Card>
    );
}
