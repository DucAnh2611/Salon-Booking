import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";

import { ESortBy } from "@/enum/query.enum";
import { IOrderClientList } from "@/interface/api/client.interface";
import SelectSort from "./select/select-sort";
interface ISheetSortClientProps {
    sort: IOrderClientList;
    onConfirm: (sort: IOrderClientList) => void;
}

export default function SheetSortClient({
    sort,
    onConfirm,
}: ISheetSortClientProps) {
    const [newSort, setNewSort] = useState<IOrderClientList>(sort);
    const [open, SetOpen] = useState<boolean>(false);

    const handleSelectSort =
        (field: keyof IOrderClientList) => (value: ESortBy | null) => {
            const newO = { ...newSort };
            if (!value) {
                delete newO[field];
            } else {
                newO[field] = value;
            }

            setNewSort(newO);
        };

    const handleConfirm = () => {
        onConfirm(newSort);
        SetOpen(false);
    };

    const onClose = (open: boolean) => {
        if (open) {
            setNewSort(sort);
        }
        SetOpen(open);
    };

    const reset = () => {
        onConfirm({});
        SetOpen(false);
    };

    useEffect(() => {
        setNewSort(sort);
    }, [sort]);

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetTrigger asChild>
                <Button variant="outline" className="gap-2 relative">
                    <SlidersHorizontal size={15} /> Sắp xếp
                    {!!Object.keys(sort).length && (
                        <div className="aspect-square p-1.5 h-fit bg-primary text-xs text-background font-bold rounded-full overflow-hidden leading-none absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                            <span>{Object.keys(sort).length}</span>
                        </div>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start justify-start gap-0">
                <SheetHeader>
                    <SheetTitle>Sắp xếp dữ liệu</SheetTitle>
                    <SheetDescription>
                        Sắp xếp dữ liệu giúp tìm kiếm hiệu quả hơn
                    </SheetDescription>
                </SheetHeader>
                <Separator orientation="horizontal" className="mb-5" />
                <div className="flex-1 w-full overflow-y-auto items-start">
                    <div className="mb-5 ">
                        <Separator orientation="horizontal" />
                        <p className="text-base font-medium my-2">
                            Sắp xếp dữ liệu
                        </p>
                        <div className="flex flex-col gap-2 flex-wrap mt-2">
                            <div className="flex gap-2 items-center justify-between">
                                <p className="flex-1 text-sm">Ngày tạo</p>
                                <div className="w-[150px]">
                                    <SelectSort
                                        value={sort.createdAt}
                                        onSelect={handleSelectSort("createdAt")}
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2 items-center justify-between">
                                <p className="flex-1 text-sm">Ngày cập nhật</p>
                                <div className="w-[150px]">
                                    <SelectSort
                                        value={sort.updatedAt}
                                        onSelect={handleSelectSort("updatedAt")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <SheetFooter className="w-full">
                    <Button
                        onClick={reset}
                        variant="outline"
                        className="w-full"
                    >
                        Xóa bộ lọc
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        variant="default"
                        className="w-full"
                    >
                        Xác nhận
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
