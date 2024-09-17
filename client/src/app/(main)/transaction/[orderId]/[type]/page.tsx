"use client";

import { toast } from "@/components/ui/use-toast";
import { EOrderTransactionReturnPayos } from "@/enum/order.enum";
import {
    IApiCancelTransaction,
    IApiSuccessTransaction,
} from "@/interface/transaction.interface";
import {
    cancelTransaction,
    successTransaction,
} from "@/lib/actions/transaction.action";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ICancelTransactionProps {
    params: { orderId: string; type: string };
}

export default function CancelTransaction({
    params: { orderId, type },
}: ICancelTransactionProps) {
    const router = useRouter();
    const search = useSearchParams();

    const [mount, SetMount] = useState<boolean>(false);

    const cancelTran = async (query: IApiCancelTransaction) => {
        const { response } = await cancelTransaction(orderId, query);

        if (response) {
            toast({
                title: "Hủy thanh toán",
                description: "Đã hủy giao dịch thanh toán.",
                variant: "destructive",
            });

            // Format of orderCode for paymentlink: <ORDER_CODE[10]><TRANSACTION_ORDER_COUNT>
            router.push(
                `/tracking?code=${query.orderCode.toString().slice(0, 10)}`
            );
        }
    };

    const successTran = async (query: IApiSuccessTransaction) => {
        const { response } = await successTransaction(orderId, query);

        if (response) {
            toast({
                title: "Đã thanh toán",
                description: "Đã hoàn thành giao dịch.",
            });

            // Format of orderCode for paymentlink: <ORDER_CODE[10]><TRANSACTION_ORDER_COUNT>
            router.push(
                `/tracking?code=${query.orderCode.toString().slice(0, 10)}`
            );
        }
    };

    useEffect(() => {
        if (!mount) {
            SetMount(true);
            return;
        }

        const code = search.get("code");
        const paymentId = search.get("id");
        const status = search.get(
            "status"
        ) as EOrderTransactionReturnPayos | null;
        const orderCode = search.get("orderCode");

        if (code && paymentId && status && orderCode) {
            switch (type) {
                case "cancel":
                    cancelTran({
                        code,
                        id: paymentId,
                        cancel: true,
                        status,
                        orderCode: parseInt(orderCode),
                    });
                    break;
                case "ok":
                    successTran({
                        code,
                        id: paymentId,
                        cancel: false,
                        status,
                        orderCode: parseInt(orderCode),
                    });
                    break;
                default:
                    return;
            }
        } else {
            toast({
                title: "Lỗi",
                description: "Yêu cầu không hợp lệ",
                variant: "destructive",
            });
            router.push("/");
        }
    }, [search, mount]);

    return <p>Đang xử lý...</p>;
}
