"use client";

import Ripple from "@/components/ui/ripple";
import { toast } from "@/components/ui/use-toast";
import { EOrderTransactionReturnPayos } from "@/enum/order.enum";
import {
    IApiFailTransaction,
    IApiSuccessTransaction,
} from "@/interface/transaction.interface";
import {
    failTransaction,
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

    const cancelTran = async (query: IApiFailTransaction) => {
        const { response } = await failTransaction(orderId, query);

        if (response) {
            toast({
                title: "Hủy thanh toán",
                description: "Đã hủy giao dịch thanh toán.",
            });
        } else {
            toast({
                title: "Thất bại",
                description: "Hủy giao dịch thất bại.",
                variant: "destructive",
            });
        }

        router.push(
            `/tracking?code=${query.orderCode.toString().slice(0, 10)}`
        );
    };

    const successTran = async (query: IApiSuccessTransaction) => {
        const { response } = await successTransaction(orderId, query);

        if (response) {
            toast({
                title: "Đã thanh toán",
                description: "Đã hoàn thành giao dịch.",
            });
        } else {
            toast({
                title: "Thất bại",
                description: "Giao dịch thất bại.",
                variant: "destructive",
            });
        }
        router.push(
            `/tracking?code=${query.orderCode.toString().slice(0, 10)}`
        );
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

    return (
        <div className="w-full h-full relative flex items-center justify-center">
            <p className="z-10 whitespace-pre-wrap text-center text-xl font-medium tracking-tighter text-foreground">
                Đang thanh toán
            </p>
            <Ripple />
        </div>
    );
}
