import CategoryDataTable from "@/components/data-table/table/category";
import CreateCategoryDialog from "@/components/dialog/category/create";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
    deleteCategoryApi,
    listCategoryApi,
} from "@/lib/redux/actions/category.action";
import { categorySelector } from "@/lib/redux/selector";
import { useAppDispatch } from "@/lib/redux/store";
import { RefreshCwIcon, Trash2Icon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";

function CategoryScreen() {
    const categoryState = useSelector(categorySelector);
    const dispatch = useAppDispatch();

    const [limit, SetLimit] = useState<number>(categoryState.limit);
    const [page, SetPage] = useDebounce<number>(categoryState.page, 500);
    const [key, SetKey] = useDebounce<string>(categoryState.key, 500);
    const [orderBy, SetOrderBy] = useDebounce<string>(
        categoryState.orderBy,
        200
    );

    const onUpdateKey = (event: ChangeEvent<HTMLInputElement>) => {
        SetKey(event.target.value);
    };

    const handlePageUpdate = (page: number) => {
        if (page < 1) {
            SetPage(1);
        }
        const maxPage = Math.ceil(categoryState.count / categoryState.limit);
        if (page <= maxPage) {
            SetPage(page);
        }
    };

    const handleReload = () => {
        dispatch(listCategoryApi(page, limit, key, orderBy));
    };

    const handleChangeOrder = (order: string) => {
        SetOrderBy(order);
    };

    const handleDelete = () => {
        dispatch(deleteCategoryApi(categoryState.deleteItems));
    };

    useEffect(() => {
        handleReload();
    }, [page, limit, key, orderBy]);

    useEffect(() => {
        const { reload } = categoryState;

        if (reload) {
            handleReload();
        }
    }, [categoryState.reload]);

    document.title = "Danh mục sản phẩm";

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="w-full h-full flex justify-between gap-4">
                    <div className="flex gap-2">
                        <div className="w-[350px]">
                            <Input
                                placeholder="Tìm kiếm"
                                onChange={onUpdateKey}
                            />
                        </div>
                        {!!categoryState.deleteItems.length && (
                            <Button
                                className="gap-2 items-center"
                                variant="destructive"
                                onClick={handleDelete}
                            >
                                <Trash2Icon size={15} /> Xóa{" "}
                                {categoryState.deleteItems.length} bản ghi
                            </Button>
                        )}
                    </div>
                    <div className="w-fit flex gap-2">
                        <Button
                            onClick={handleReload}
                            variant="outline"
                            className="gap-1"
                            disabled={categoryState.isCalling}
                        >
                            <RefreshCwIcon
                                size={14}
                                className={`${
                                    categoryState.isCalling
                                        ? "animate-spin"
                                        : ""
                                }`}
                            />
                            <p className="font-normal">
                                {categoryState.isCalling
                                    ? "Đang tải"
                                    : "Tải lại"}
                            </p>
                        </Button>
                        <CreateCategoryDialog />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <CategoryDataTable
                    count={categoryState.count}
                    items={categoryState.items}
                    page={categoryState.page}
                    limit={categoryState.limit}
                    handleChangeOrder={handleChangeOrder}
                    handlePageUpdate={handlePageUpdate}
                />
            </CardContent>
        </Card>
    );
}

export default CategoryScreen;
