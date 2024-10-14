import { ORDER_REFUND_REQUEST_STATUS } from "@/constants/order.constant";
import { EOrderRefundRequestStatus } from "@/enum/order.enum";
import { IOrderDetailRefund } from "@/interface/api/order-detail.interface";
import { cn } from "@/lib";
import { detailOrderRefund } from "@/lib/redux/actions/order-detail.action";
import { orderDetailSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { formatMoney } from "@/utils/money";
import { format } from "date-fns";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { useState } from "react";
import DialogApprovedRefund from "./dialog/dialog-approved-refund";
import DialogDeclineRefund from "./dialog/dialog-decline-refund";
import RefundStateCard from "./refund-state-card";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

const colorSchema: Record<EOrderRefundRequestStatus, string> = {
    [EOrderRefundRequestStatus.PENDING]: "hsl(var(--primary))",
    [EOrderRefundRequestStatus.APPROVED]: "#3b82f6",
    [EOrderRefundRequestStatus.DECLINE]: "hsl(var(--destructive))",
    [EOrderRefundRequestStatus.EXPIRED]: "#a855f7  ",
    [EOrderRefundRequestStatus.RECEIVED]: "#4ade80",
    [EOrderRefundRequestStatus.CANCELLED]: "hsl(var(--destructive))",
};

interface IRefundRequestCardProps {
    refund: IOrderDetailRefund;
}

export default function RefundRequestCard({ refund }: IRefundRequestCardProps) {
    const {
        base: { base: order },
    } = useAppSelector(orderDetailSelector);
    const dispatch = useAppDispatch();
    const [open, SetOpen] = useState<boolean>(false);

    const toggleDetail = () => {
        SetOpen((o) => !o);
    };

    const onSuccessRequest = () => {
        if (order) {
            dispatch(detailOrderRefund(order.id));
        }
    };

    return (
        <Card
            style={{ borderColor: colorSchema[refund.status] }}
            className={cn("overflow-hidden", `border`)}
        >
            <CardHeader className="p-2 bg-muted group">
                <div className="w-full flex justify-between items-center text-sm">
                    <span className="font-medium">
                        {format(refund.createdAt, "yyyy/MM/dd HH:mm")}
                    </span>
                    <span
                        style={{ color: colorSchema[refund.status] }}
                        className={cn("font-medium")}
                    >
                        {ORDER_REFUND_REQUEST_STATUS[refund.status]}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-2 group">
                <div
                    className={cn(
                        "w-full overflow-hidden flex-col gap-3",
                        open ? "flex" : "hidden"
                    )}
                >
                    {refund.orderId && (
                        <div className="w-full text-sm flex flex-col gap-1">
                            <span className="font-medium">Đơn hàng:</span>
                            <span className="uppercase text-muted-foreground">
                                {order?.code}
                            </span>
                        </div>
                    )}

                    {refund.transaction && (
                        <div className="w-full text-sm flex flex-col gap-1">
                            <span className="font-medium">Giao dịch:</span>
                            <span className="uppercase text-muted-foreground">
                                {refund.transaction.paymentId}
                            </span>
                        </div>
                    )}

                    <div className="w-full">
                        <span className="font-medium">Ngân hàng:</span>
                        <div className="flex gap-3 w-full mt-2 items-start">
                            <img
                                src={refund.bank.logo}
                                alt="refund_bank"
                                className="w-10 h-10 rounded-full overflow-hidden object-contain bg-white"
                            />
                            <div className="flex-1 h-fit">
                                <p className="text-primary font-medium">
                                    {refund.bank.code}
                                </p>

                                <p className="">{refund.bank.name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 text-sm  w-full">
                        <span className="font-medium">Số tài khoản:</span>

                        <span className="">{refund.accountBankNumber}</span>
                    </div>

                    <div className="flex gap-2 text-sm  w-full">
                        <span className="font-medium">Ghi chú:</span>

                        <p className="whitespace-pre-line">
                            {refund.description || "Không"}
                        </p>
                    </div>

                    <Separator orientation="horizontal" className="" />

                    <div>
                        <p className="text-base font-medium whitespace-nowrap">
                            Trạng thái hoàn tiền
                        </p>
                        <Separator className="my-1" orientation="horizontal" />
                        <div className="flex flex-col gap-1 max-h-[400px] overflow-auto">
                            {refund.orderRefundStates.map((state) => (
                                <div key={state.id}>
                                    <RefundStateCard state={state} />
                                </div>
                            ))}
                            {!refund.orderRefundStates.length && (
                                <div className="text-sm py-2 text-center w-full">
                                    Không có lịch sử yêu cầu
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Separator orientation="horizontal" className="my-1" />
                <div className="flex w-full my-2 flex-col">
                    <div className="flex w-full gap-2 text-sm justify-end">
                        <div className="w-fit">
                            <span className="font-medium mr-1">Tổng:</span>
                            <span className="font-medium">
                                {formatMoney(refund.amount)}
                            </span>
                        </div>
                    </div>
                    {open &&
                        refund.status === EOrderRefundRequestStatus.PENDING && (
                            <div className="flex w-full gap-2 mt-2">
                                <div className="flex-1">
                                    <DialogDeclineRefund
                                        trigger={
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="w-full bg-red-500 text-red-500 bg-opacity-15 hover:bg-opacity-25 hover:bg-red-500"
                                            >
                                                Từ chối
                                            </Button>
                                        }
                                        requestId={refund.id}
                                        onSuccess={onSuccessRequest}
                                    />
                                </div>
                                <div className="flex-1">
                                    <DialogApprovedRefund
                                        trigger={
                                            <Button
                                                size="sm"
                                                className="w-full"
                                            >
                                                Duyệt
                                            </Button>
                                        }
                                        requestId={refund.id}
                                        onSuccess={onSuccessRequest}
                                    />
                                </div>
                            </div>
                        )}
                </div>

                <Separator orientation="horizontal" className="my-1" />
                <div>
                    <Button
                        variant="ghost"
                        className="w-full gap-2 justify-center text-muted-foreground text-xs"
                        onClick={toggleDetail}
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
            </CardContent>
        </Card>
    );
}
