"use client";

import useOrderTracking from "@/hook/useOrderTracking.hook";
import { cn } from "@/lib/utils";
import { ChevronsDown, ChevronsUp, LoaderCircle } from "lucide-react";
import { useState } from "react";
import RefundRequestCard from "./refund-request-card";
import RefundStateCard from "./refund-state-card";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Separator } from "./ui/separator";

export default function OrderTrackingRefund() {
    const {
        refund: { refunds, isLoading },
        reload,
    } = useOrderTracking();

    const [open, SetOpen] = useState<boolean>(false);

    const toggleOpen = () => {
        SetOpen((o) => !o);
    };

    return (
        <div className="w-full">
            <Card className="w-full h-fit">
                <CardHeader>
                    <div className="flex gap-3 w-full items-start">
                        <div className="flex-1">
                            <CardTitle>Yêu cầu hoàn tiền</CardTitle>
                            <CardDescription>
                                Các yêu cầu hoàn tiền và trạng thái của các yêu
                                cầu.
                            </CardDescription>
                        </div>
                        <Button
                            className="gap-2"
                            size="sm"
                            variant="outline"
                            onClick={() => reload("refund")}
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
                        <Separator orientation="horizontal" />
                        <CardContent className="py-5 relative">
                            <div className="flex flex-col w-full gap-2">
                                {refunds.map((refund) => (
                                    <div key={refund.id} className="w-full">
                                        <HoverCard
                                            openDelay={300}
                                            closeDelay={100}
                                        >
                                            <HoverCardTrigger>
                                                <RefundRequestCard
                                                    refund={refund}
                                                />
                                            </HoverCardTrigger>
                                            <HoverCardContent
                                                align="start"
                                                side="left"
                                                className="w-[400px]"
                                            >
                                                <p className="text-base font-medium whitespace-nowrap">
                                                    Trạng thái hoàn tiền
                                                </p>
                                                <Separator
                                                    className="my-1"
                                                    orientation="horizontal"
                                                />
                                                <div className="flex flex-col gap-1 max-h-[400px] overflow-auto">
                                                    {refund.orderRefundStates.map(
                                                        (state) => (
                                                            <div key={state.id}>
                                                                <RefundStateCard
                                                                    state={
                                                                        state
                                                                    }
                                                                />
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
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
