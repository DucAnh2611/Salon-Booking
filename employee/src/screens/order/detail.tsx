import OrderDetailTab from "@/components/order-detail-tab";
import OrderPaymentTab from "@/components/order-payment-tab";
import OrderStatesCard from "@/components/order-states-card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ESocketEvent, ESocketMessage } from "@/enum/socket.enum";
import useSocket from "@/hooks/useSocket";
import {
    detailOrder,
    detailOrderRefund,
    detailOrderState,
    detailOrderTransaction,
} from "@/lib/redux/actions/order-detail.action";
import { orderDetailSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { List } from "lucide-react";
import { useEffect } from "react";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

function OrderDetailMain({ id }: { id: string }) {
    const navigate = useNavigate();

    const [param] = useSearchParams();
    const dispatch = useAppDispatch();

    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (!socket || !isConnected) return;

        if (socket) {
            socket.emit(ESocketMessage.EMPLOYEE_TRACKING_ORDER, {
                orderId: id,
            });

            socket.on(ESocketEvent.CLIENT_ORDER_UPDATED, () => {
                dispatch(detailOrder(id));
                dispatch(detailOrderState(id));
                dispatch(detailOrderRefund(id));
                dispatch(detailOrderTransaction(id));
            });

            return () => {
                socket.emit(ESocketMessage.EMPLOYEE_UNTRACK_ORDER, {
                    orderId: id,
                });
                socket.off(ESocketEvent.CLIENT_ORDER_UPDATED);
            };
        }
    }, [socket, isConnected, id]);

    return (
        <div className="flex-1 w-full h-fit">
            <Tabs
                value={param.get("tab") || "order"}
                onValueChange={(value) => {
                    navigate(`?tab=${value}`, { replace: true });
                }}
                className="min-h-full w-full flex flex-col gap-2"
            >
                <div className="flex justify-between w-full">
                    <div className="flex-1  flex gap-2">
                        <div className="w-fit">
                            <TabsList className="w-fit">
                                <TabsTrigger value="order">
                                    Đơn hàng
                                </TabsTrigger>
                                <TabsTrigger value="payment">
                                    Thanh toán
                                </TabsTrigger>
                            </TabsList>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" className="gap-2" asChild>
                            <Link to={"/order"}>
                                <List size={15} />
                                Danh sách đơn hàng
                            </Link>
                        </Button>
                    </div>
                </div>
                <div className="flex-1 h-fit min-h-full w-full grid grid-cols-7 gap-5 items-start">
                    <div className="col-span-5">
                        <TabsContent value="order" className="m-0">
                            <OrderDetailTab />
                        </TabsContent>
                        <TabsContent value="payment" className="m-0">
                            <OrderPaymentTab />
                        </TabsContent>
                    </div>
                    <div className="col-span-2">
                        <OrderStatesCard />
                    </div>
                </div>
            </Tabs>
        </div>
    );
}

export default function OrderDetailScreen() {
    const { id } = useParams();

    const dispatch = useAppDispatch();
    const {
        base: { base },
    } = useAppSelector(orderDetailSelector);

    useEffect(() => {
        if (id && (!base || base.id !== id)) {
            dispatch(detailOrder(id));
        }
    }, [id]);

    if (!id) return <p> no id provided</p>;

    return <OrderDetailMain id={id} />;
}
