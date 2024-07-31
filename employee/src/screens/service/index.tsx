import ServiceDataTable from "@/components/data-table/table/service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ROUTER_PATH } from "@/constants/router.constant";
import useDebounce from "@/hooks/useDebounce";
import usePagination from "@/hooks/usePagination";
import {
    deleteServiceApi,
    listServiceApi,
} from "@/lib/redux/actions/service.action";
import { serviceSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { PlusIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";
import { ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ServiceScreen() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const {
        deleteItems,
        isCalling,
        count,
        reload,
        limit: stateLimit,
        services,
    } = useAppSelector(serviceSelector);

    const { limit, page, SetPage } = usePagination({
        defLimit: 10,
        defPage: 1,
    });
    const [key, SetKey] = useDebounce("");
    const [orderBy, SetOrderby] = useDebounce("");

    const onUpdateKey = (e: ChangeEvent<HTMLInputElement>) => {
        SetKey(e.target.value);
    };

    const handleReload = () => {
        dispatch(listServiceApi(page, limit, key, orderBy));
    };

    const handleChangeOrder = (orderBy: string) => {
        SetOrderby(orderBy);
    };

    const handlePageUpdate = (page: number) => {
        if (page < 1) {
            SetPage(1);
        }
        const maxPage = Math.ceil(count / stateLimit);
        if (page <= maxPage) {
            SetPage(page);
        }
    };

    const handleCreate = () => {
        navigate(`${ROUTER_PATH.SERVICE}/add`);
    };

    const handleDelete = () => {
        dispatch(deleteServiceApi(deleteItems));
    };

    useEffect(() => {
        handleReload();
    }, [key, limit, page, orderBy]);

    useEffect(() => {
        if (reload) handleReload();
    }, [reload]);

    return (
        <Card>
            <CardHeader>
                <div className="w-full h-full flex justify-between gap-4">
                    <div className="flex gap-2">
                        <div className="w-[350px]">
                            <Input
                                placeholder="Tìm kiếm"
                                onChange={onUpdateKey}
                            />
                        </div>
                        {!!deleteItems.length && (
                            <Button
                                className="gap-2 items-center"
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                <Trash2Icon size={15} /> Xóa{" "}
                                {deleteItems.length} bản ghi
                            </Button>
                        )}
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
                                {isCalling ? "Đang tải" : "Tải lại"}
                            </p>
                        </Button>

                        <Button className="gap-1" onClick={handleCreate}>
                            <PlusIcon size={14} />
                            <p className="font-normal">Tạo mới</p>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <ServiceDataTable
                    page={page}
                    limit={limit}
                    count={count}
                    services={services}
                    handleChangeOrder={handleChangeOrder}
                    handlePageUpdate={handlePageUpdate}
                />
            </CardContent>
        </Card>
    );
}
