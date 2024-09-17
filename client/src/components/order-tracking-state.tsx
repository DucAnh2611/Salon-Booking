import { ORDER_STATUS } from "@/constant/order.constant";
import useOrderTracking from "@/hook/useOrderTracking.hook";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ChevronsDown, ChevronsUp, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

interface IOrderTrackingStateProps {}

export default function OrderTrackingState({}: IOrderTrackingStateProps) {
    const {
        state: { states, isLoading },
        reload,
    } = useOrderTracking();

    const [open, SetOpen] = useState<boolean>(true);

    const toggleOpen = () => {
        SetOpen((o) => !o);
    };

    if (!states.length) return <></>;

    return (
        <div className="w-full">
            <Card className="w-full h-fit">
                <CardHeader>
                    <div className="flex gap-3 w-full items-start">
                        <div className="flex-1">
                            <CardTitle>Trạng thái đơn hàng</CardTitle>
                            <CardDescription>
                                Các trạng thái của đơn hàng.
                            </CardDescription>
                        </div>
                        <Button
                            className="gap-2"
                            size="sm"
                            variant="outline"
                            onClick={() => reload("state")}
                            disabled={isLoading}
                        >
                            {isLoading && (
                                <LoaderCircle
                                    size={15}
                                    className={cn("animate-spin")}
                                />
                            )}
                            Làm mới
                        </Button>
                    </div>
                </CardHeader>
                {open && (
                    <>
                        <Separator className="mb-0" orientation="horizontal" />
                        <CardContent className="relative py-5">
                            <div className="flex flex-col relative h-fit">
                                <div className="absolute left-2 top-0 h-full w-0 border-muted-foreground border-l-[0.5px] -translate-x-1/2 z-[0]" />
                                {states.map((state, i) => (
                                    <div
                                        key={state.id}
                                        className="relative w-full h-fit flex gap-3 py-2 items-start"
                                    >
                                        <div
                                            className={cn(
                                                "w-4 h-4 border rounded-full bg-background relative p-0.5 box-border",
                                                i
                                                    ? "border-muted-foreground"
                                                    : "border-primary"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "w-full h-full rounded-full z-[1] relative",
                                                    i
                                                        ? ""
                                                        : "bg-primary animate-ping"
                                                )}
                                            />
                                        </div>
                                        <div
                                            className={cn(
                                                "flex-1 font-medium",
                                                i ? "" : "text-primary"
                                            )}
                                        >
                                            <p className="w-full whitespace-normal break-words text-xs italic">
                                                {format(
                                                    state.createdAt,
                                                    "yyyy/MM/dd hh:mm aaa"
                                                )}
                                            </p>
                                            <p className="w-full whitespace-normal break-words text-sm mt-1">
                                                {ORDER_STATUS[state.state]}
                                            </p>
                                            {state.description && (
                                                <p className="w-full whitespace-normal break-words text-sm text-muted-foreground italic">
                                                    {state.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {isLoading && (
                                <div className="w-full h-full absolute top-0 left-0 z-[2] flex items-center justify-center py-3  backdrop-blur">
                                    <div className="w-full h-full absolute top-0 left-0 z-0 bg-muted opacity-25" />
                                    <div className="flex gap-2 items-center text-sm relative">
                                        <span>
                                            <LoaderCircle
                                                size={15}
                                                className="animate-spin"
                                            />
                                        </span>
                                        <span>Đang tải</span>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </>
                )}
                <Separator orientation="horizontal" />
                <div className="w-full">
                    <Button
                        variant="ghost"
                        className="w-full gap-2 justify-center text-muted-foreground text-xs rounded-none"
                        onClick={toggleOpen}
                    >
                        {!open ? (
                            <>
                                <ChevronsDown size={15} />
                                Xem thêm
                            </>
                        ) : (
                            <>
                                <ChevronsUp size={15} />
                                Thu gọn
                            </>
                        )}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
