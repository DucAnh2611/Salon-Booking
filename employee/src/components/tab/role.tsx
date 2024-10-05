import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ROUTER_PATH } from "@/constants/router.constant";
import useDebounce from "@/hooks/useDebounce";
import usePagination from "@/hooks/usePagination";
import { deleteRoleApi, listRoleApi } from "@/lib/redux/actions/role.action";
import { roleSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { PlusIcon, RefreshCwIcon, Trash2Icon } from "lucide-react";
import { ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RoleDataTable from "../data-table/table/role";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function RoleListTab() {
    const dispatch = useAppDispatch();
    const {
        reload,
        roles,
        count,
        limit: stateLimit,
        isCalling,
        deleteItems,
    } = useAppSelector(roleSelector);
    const navigate = useNavigate();

    const { limit, page, SetPage } = usePagination({});
    const [key, SetKey] = useDebounce<string>("");
    const [orderBy, SetOrderBy] = useDebounce<string>("");

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        SetKey(e.target.value);
    };

    const handleReload = () => {
        dispatch(listRoleApi(page, limit, key, orderBy));
    };

    const handleChangeOrder = (orderBy: string) => {
        SetOrderBy(orderBy);
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
        navigate(`${ROUTER_PATH.ROLE}/add`);
    };

    const handleDelete = () => {
        dispatch(deleteRoleApi(deleteItems));
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
                                onChange={handleSearch}
                            />
                        </div>
                        {!!deleteItems.length && (
                            <Button
                                className="gap-2 items-center"
                                variant="destructive"
                                disabled={deleteItems.some(
                                    (item) =>
                                        !roles.find((role) => role.id === item)
                                            ?.deletable
                                )}
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
                <RoleDataTable
                    roles={roles}
                    count={count}
                    page={page}
                    limit={limit}
                    handleChangeOrder={handleChangeOrder}
                    handlePageUpdate={handlePageUpdate}
                />
            </CardContent>
        </Card>
    );
}
