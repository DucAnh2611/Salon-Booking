import { PreviewMediaDialog } from "@/components/dialog/media/preview";
import UploadMediaDialog from "@/components/dialog/media/uploads";
import SelectMediaTypeDropdown from "@/components/dropdown/select-media";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { EFileType } from "@/enum/media.enum";
import useDebounce from "@/hooks/useDebounce";
import { IActionDedicateMediaParam } from "@/interface/redux/media.interface";
import {
    deleteMediaApi,
    listMediaApi,
    setDeleteMediaApi,
    setMediaParam,
} from "@/lib/redux/actions/media.action";
import { mediaSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Tooltip } from "@radix-ui/react-tooltip";
import {
    ChevronDown,
    ChevronUp,
    ImageOffIcon,
    RefreshCwIcon,
    Trash2Icon,
} from "lucide-react";
import { ChangeEvent, useEffect } from "react";
import { DeepPartial } from "react-hook-form";

function MediaScreen() {
    const dispatch = useAppDispatch();
    const {
        isCalling,
        reload,
        medias,
        page,
        key,
        count,
        limit,
        orderBy,
        typeMedia,
        deleteItems,
    } = useAppSelector(mediaSelector);

    const [searchKey, SetSearchKey] = useDebounce<string>("");

    const handleReload = () => {
        dispatch(listMediaApi(page, limit, key, typeMedia, orderBy));
    };

    const handleChangeKey = (e: ChangeEvent<HTMLInputElement>) => {
        SetSearchKey(e.target.value);
    };

    const handleDeleteList = (id: string) => (check: CheckedState) => {
        if (check) {
            dispatch(setDeleteMediaApi([...deleteItems, id]));
        } else {
            dispatch(setDeleteMediaApi(deleteItems.filter((i) => i !== id)));
        }
    };

    const handleChangeParam = (
        param: DeepPartial<IActionDedicateMediaParam>
    ) => {
        dispatch(setMediaParam(param));
    };

    const handleDelete = () => {
        dispatch(deleteMediaApi(deleteItems));
    };

    const handleChangeFileType = (type: EFileType | null) => {
        handleChangeParam({ typeMedia: type });
    };

    const handlePageUpdate = (page: number) => {
        if (page < 1) {
            handleChangeParam({ page: 1 });
        }
        const maxPage = Math.ceil(count / limit);
        if (page <= maxPage) {
            handleChangeParam({ page: page });
        }
    };

    const handleToggleOrder = () => {
        const tempOrder = orderBy.split("_");

        tempOrder[0] = tempOrder[0] === "d" ? "a" : "d";

        handleChangeParam({
            orderBy: tempOrder.join("_"),
        });
    };

    const handleSelectDeleteAll = () => {
        dispatch(
            setDeleteMediaApi(
                deleteItems.length === medias.length
                    ? []
                    : medias.map((media) => media.id)
            )
        );
    };

    useEffect(() => {
        handleReload();
    }, [page, limit, key, orderBy, typeMedia]);

    useEffect(() => {
        if (reload) {
            handleReload();
        }
    }, [reload]);

    useEffect(() => {
        handleChangeParam({ key: searchKey });
    }, [searchKey]);

    return (
        <Card className="h-fit flex flex-col">
            <CardHeader className="pb-3 h-fit">
                <div className="w-full h-full flex justify-between gap-4">
                    <div className="flex gap-2">
                        {!!deleteItems.length && (
                            <>
                                <TooltipProvider>
                                    <Tooltip delayDuration={0}>
                                        <TooltipTrigger>
                                            <Button
                                                className="gap-2 items-center text-destructive"
                                                variant="outline"
                                                onClick={handleSelectDeleteAll}
                                            >
                                                {deleteItems.length ===
                                                medias.length
                                                    ? "Bỏ chọn hết"
                                                    : "Chọn hết"}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>
                                                Chọn hết số lượng bản ghi của
                                                trang hiện tại
                                            </p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Button
                                    className="gap-2 items-center"
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    <Trash2Icon size={15} /> Xóa{" "}
                                    {deleteItems.length} bản ghi
                                </Button>
                            </>
                        )}
                        <div className="w-[350px]">
                            <Input
                                placeholder="Tìm kiếm"
                                onChange={handleChangeKey}
                            />
                        </div>
                        <SelectMediaTypeDropdown
                            onChange={handleChangeFileType}
                            type={typeMedia}
                        />
                        <Button
                            variant="outline"
                            className="gap-2"
                            onClick={handleToggleOrder}
                        >
                            Ngày tạo
                            {orderBy.startsWith("d") ? (
                                <ChevronDown size={15} />
                            ) : (
                                <ChevronUp size={15} />
                            )}
                        </Button>
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
                        <UploadMediaDialog />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="w-full">
                <div className="w-full h-fit">
                    {!!medias.length ? (
                        <div>
                            <div className="w-full h-fit grid grid-cols-5 gap-4 gap-y-4">
                                {medias.map((media) => (
                                    <div
                                        key={media.id}
                                        className={`w-full aspect-square rounded-md overflow-hidden group/media relative ${
                                            deleteItems.find(
                                                (id) => media.id === id
                                            )
                                                ? "border-primary border"
                                                : ""
                                        }`}
                                    >
                                        <Checkbox
                                            className="bg-accent absolute top-2 left-2 box-border z-[1] w-5 h-5"
                                            onCheckedChange={handleDeleteList(
                                                media.id
                                            )}
                                            checked={deleteItems.includes(
                                                media.id
                                            )}
                                        />
                                        <PreviewMediaDialog media={media} />
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-end pt-3">
                                <div className="flex-1 text-sm text-muted-foreground">
                                    Bản ghi từ {(page - 1) * limit + 1} tới{" "}
                                    {(page - 1) * limit + medias.length} trong
                                    tổng số {count} bản ghi{" "}
                                </div>
                                <div className="flex justify-start gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handlePageUpdate(page - 1)
                                        }
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
                                                handlePageUpdate(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            / {Math.ceil(count / limit)}
                                        </p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handlePageUpdate(page + 1)
                                        }
                                        disabled={
                                            page >= Math.ceil(count / limit)
                                        }
                                    >
                                        Trang sau
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-full flex justify-center items-center border rounded-md flex-col gap-2 py-10">
                            <ImageOffIcon size={30} />
                            <p className="text-sm">
                                Không có tệp phương tiện nào.
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default MediaScreen;
