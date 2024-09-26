import { ORDER_REFUND_STATUS } from "@/constants/order.constant";
import { EOrderRefundStatus } from "@/enum/order.enum";
import { IRefundState } from "@/interface/api/refund-state.interface";
import { api_media_url } from "@/utils/apiCall";
import { joinString } from "@/utils/string";
import { format } from "date-fns";
import { Card } from "./ui/card";

interface IRefundStateCardProps {
    state: IRefundState;
}

const colorSchema: Record<EOrderRefundStatus, string> = {
    [EOrderRefundStatus.PENDING]: "hsl(var(--primary))",
    [EOrderRefundStatus.APPROVED]: "#3b82f6",
    [EOrderRefundStatus.DECLINE]: "hsl(var(--destructive))",
    [EOrderRefundStatus.RECEIVED]: "#4ade80",
    [EOrderRefundStatus.CANCELLED]: "hsl(var(--destructive))",
};

export default function RefundStateCard({ state }: IRefundStateCardProps) {
    return (
        <Card className="p-2 flex flex-col gap-1">
            <p className="text-sm" style={{ color: colorSchema[state.status] }}>
                {ORDER_REFUND_STATUS[state.status]}
            </p>
            {state.bankTransactionCode && (
                <div className="w-full flex gap-3">
                    {state.media && <div></div>}
                    <div>
                        <div className="text-sm">
                            <p className="font-medium">
                                Mã giao dịch ngân hàng
                            </p>
                            <p className="text-muted-foreground whitespace-nowrap w-full">
                                {state.bankTransactionCode}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <div>
                <div className="text-sm">
                    <p className="font-medium">Ngày tạo</p>
                    <p className="text-muted-foreground whitespace-nowrap w-full">
                        {format(state.createdAt, "yyyy/MM/dd HH:mm:ss")}
                    </p>
                </div>
            </div>
            {state.note && (
                <div>
                    <div className="text-sm">
                        <p className="font-medium">Ghi chú</p>
                        <p className="text-muted-foreground whitespace-pre-line w-full">
                            {state.note}
                        </p>
                    </div>
                </div>
            )}
            {state.media && (
                <div>
                    <div className="text-sm">
                        <p className="font-medium">Ảnh</p>
                        <div className="w-full h-fit grid grid-cols-3">
                            <div>
                                <img
                                    alt="rf"
                                    src={joinString({
                                        joinString: "/",
                                        strings: [
                                            api_media_url,
                                            state.media.path,
                                        ],
                                    })}
                                    className="w-full h-fit max-h-[200px] object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
}
