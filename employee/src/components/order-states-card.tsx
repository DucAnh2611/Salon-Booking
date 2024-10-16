import { ORDER_STATUS } from "@/constants/order.constant";
import { cn } from "@/lib";
import {
    detailOrder,
    detailOrderState,
} from "@/lib/redux/actions/order-detail.action";
import { orderDetailSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useEffect } from "react";
import DialogAddOrderState from "./dialog/dialog-add-order-state";
import DialogCancelOrder from "./dialog/dialog-cancel-order";
import Failure from "./failure";
import Loading from "./loading";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";
export default function OrderStatesCard() {
    const {
        base: { base },
        status: { isCalling, isFailure, states, reload },
    } = useAppSelector(orderDetailSelector);
    const dispatch = useAppDispatch();

    const onSuccessCancelOrder = () => {
        if (base) {
            dispatch(detailOrderState(base.id));
            dispatch(detailOrder(base.id));
        }
    };

    useEffect(() => {
        if (base && (base || reload)) {
            dispatch(detailOrderState(base.id));
        }
    }, [base, reload]);

    return (
        <div className="w-full h-fit flex flex-col gap-5">
            {base && base.cancelable && base.cancelType !== "none" && (
                <div className="flex gap-3 bg-background border border-destructive rounded p-3 items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                        Khách hàng không có mặt hoặc muốn hủy đơn?
                    </p>
                    <DialogCancelOrder
                        trigger={
                            <Button variant={"destructive"}>
                                {base.cancelType === "no_refund"
                                    ? "Hủy đơn giữ phí"
                                    : "Hủy đơn"}
                            </Button>
                        }
                        orderId={base.id}
                        type={base.cancelType}
                        onSuccess={onSuccessCancelOrder}
                    />
                </div>
            )}
            <Card>
                <CardHeader>
                    <CardTitle>Trạng thái đơn hàng</CardTitle>
                    <CardDescription>
                        Các trạng thái đơn hàng, có thể thêm, trạng thái cho đơn
                        hàng
                    </CardDescription>
                </CardHeader>
                <Separator orientation="horizontal" />
                <CardContent className="w-full relative p-3">
                    {isCalling && <Loading />}
                    {isFailure && <Failure />}
                    <div className="relative w-full">
                        {!!base && (
                            <>
                                {base.updateState && (
                                    <DialogAddOrderState
                                        trigger={
                                            <Button
                                                className="w-full"
                                                variant="outline"
                                            >
                                                <PlusIcon
                                                    size={15}
                                                    className="mr-1"
                                                />
                                                Thêm trạng thái
                                            </Button>
                                        }
                                        orderId={base.id}
                                        type={base.type}
                                    />
                                )}
                                {base.showUnPaid && (
                                    <div className="w-full rounded bg-red-500 bg-opacity-15 text-red-500 font-medium text-sm py-2 flex-1">
                                        <p className="w-full text-center">
                                            Chưa thanh toán
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
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
                                            i ? "" : "bg-primary animate-ping"
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
                                            "yyyy/MM/dd HH:mm:ss"
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
                </CardContent>
            </Card>
        </div>
    );
}
