import { IFilterClientList } from "@/interface/api/client.interface";
import { cn } from "@/lib";
import { Check, Filter, XIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
import { Toggle } from "./ui/toggle";

interface ISheetFilterClientProps {
    filter: IFilterClientList;
    onConfirm: (filter: IFilterClientList) => void;
}

export default function SheetFilterClient({
    filter,
    onConfirm,
}: ISheetFilterClientProps) {
    const [open, SetOpen] = useState<boolean>(false);
    const [newFilter, SetNewFilter] = useState<IFilterClientList>(filter);

    const handleChangeText =
        (key: keyof Omit<IFilterClientList, "lockAccount" | "lockOrder">) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            SetNewFilter((f) => ({
                ...f,
                [key]: e.target.value,
            }));
        };
    const handleChangeBoolean =
        (
            key: keyof Pick<IFilterClientList, "lockAccount" | "lockOrder">,
            value?: "on" | "off"
        ) =>
        () => {
            SetNewFilter((f) => {
                const { [key]: field, ...props } = f;
                return {
                    ...props,
                    ...(value !== undefined ? { [key]: value === "on" } : {}),
                };
            });
        };

    const handleConfirm = () => {
        onConfirm(newFilter);
        SetOpen(false);
    };

    const onClose = (open: boolean) => {
        if (open) {
            SetNewFilter(filter);
        }
        SetOpen(open);
    };

    const reset = () => {
        onConfirm({});
        SetOpen(false);
    };

    useEffect(() => {
        SetNewFilter(filter);
    }, [filter]);

    return (
        <Sheet open={open} onOpenChange={onClose}>
            <SheetTrigger asChild>
                <Button variant={"outline"} className="gap-2 relative">
                    <Filter size={15} /> Bộ lọc
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col items-start justify-start gap-0 lg:!max-w-none w-[400px]">
                <SheetHeader>
                    <SheetTitle>Bộ lọc khách hàng</SheetTitle>
                    <SheetDescription>
                        Giúp tìm kiếm khách hàng
                    </SheetDescription>
                </SheetHeader>
                <Separator orientation="horizontal" className="mb-5" />
                <div className="flex-1 w-full overflow-y-auto items-start flex flex-col gap-2">
                    <div className="w-full grid grid-cols-7 items-center gap-2">
                        <Label htmlFor="name" className="col-span-3">
                            Tên
                        </Label>
                        <Input
                            id="name"
                            placeholder="Tên"
                            onChange={handleChangeText("name")}
                            value={newFilter.name}
                            className="col-span-4 focus-visible:ring-transparent"
                        />
                    </div>
                    <div className="w-full grid grid-cols-7 items-center gap-2">
                        <Label htmlFor="email" className="col-span-3">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="Email"
                            onChange={handleChangeText("email")}
                            value={newFilter.email}
                            className="col-span-4 focus-visible:ring-transparent"
                        />
                    </div>
                    <div className="w-full grid grid-cols-7 items-center gap-2">
                        <Label htmlFor="phone" className="col-span-3">
                            SĐT
                        </Label>
                        <Input
                            id="phone"
                            placeholder="SĐT"
                            onChange={handleChangeText("phone")}
                            value={newFilter.phone}
                            className="col-span-4 focus-visible:ring-transparent"
                        />
                    </div>
                    <div className="w-full items-center gap-2">
                        <Label className="w-full">Khóa tài khoản</Label>

                        <div className="flex gap-3 mt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "col-span-4 gap-1 items-center flex-1",
                                    newFilter.lockAccount === undefined &&
                                        "border-primary text-primary"
                                )}
                                onClick={handleChangeBoolean("lockAccount")}
                                type="button"
                            >
                                Không
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "col-span-4 gap-1 items-center flex-1",
                                    newFilter.lockAccount &&
                                        "border-green-500 text-green-500"
                                )}
                                onClick={handleChangeBoolean(
                                    "lockAccount",
                                    "on"
                                )}
                                type="button"
                            >
                                {newFilter.lockAccount !== undefined &&
                                    newFilter.lockAccount && (
                                        <Check size={15} />
                                    )}
                                <span>Hoạt động</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "col-span-4 gap-1 items-center flex-1",
                                    newFilter.lockAccount !== undefined &&
                                        !newFilter.lockAccount &&
                                        "border-red-500 text-red-500"
                                )}
                                onClick={handleChangeBoolean(
                                    "lockAccount",
                                    "off"
                                )}
                                type="button"
                            >
                                {newFilter.lockAccount !== undefined &&
                                    !newFilter.lockAccount && (
                                        <XIcon size={15} />
                                    )}
                                <span>Khóa</span>
                            </Button>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-7 items-center gap-2">
                        <Label htmlFor="phone" className="col-span-3">
                            Khóa đặt đơn
                        </Label>
                        <Toggle
                            id="lockOrder"
                            variant="outline"
                            size="sm"
                            className={cn(
                                "col-span-4 gap-1 items-center",
                                !newFilter.lockOrder
                                    ? "border-green-500 text-green-500"
                                    : "border-red-500 text-red-500"
                            )}
                            onClick={handleChangeBoolean("lockOrder", "off")}
                            type="button"
                        >
                            {newFilter.lockOrder ? (
                                <>
                                    <XIcon size={15} /> <span>Khóa</span>
                                </>
                            ) : (
                                <>
                                    <Check size={15} /> <span>Hoạt động</span>
                                </>
                            )}
                        </Toggle>
                    </div>
                </div>
                <SheetFooter className="w-full mt-5">
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
