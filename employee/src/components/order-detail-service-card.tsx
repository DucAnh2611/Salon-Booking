import { EOrderType } from "@/enum/order.enum";
import { detailOrderService } from "@/lib/redux/actions/order-detail.action";
import { orderDetailSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useEffect } from "react";
import Failure from "./failure";
import Loading from "./loading";
import OrderDetailServiceItem from "./order-detail-service-items";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";

export default function OrderDetailServiceCard() {
    const {
        base: { base },
        service: { services, isCalling, isFailure },
    } = useAppSelector(orderDetailSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (base && base.type === EOrderType.SERVICE) {
            dispatch(detailOrderService(base.id));
        }
    }, [base]);

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Thông tin dịch vụ</CardTitle>
                <CardDescription>
                    Thông tin về dịch vụ, nhân viên phục vụ cho từng dịch vụ.
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full relative">
                {isCalling && <Loading />}
                {isFailure && <Failure />}
                <div className="grid grid-cols-1 gap-3">
                    {services.map((item) => (
                        <div key={item.id}>
                            <OrderDetailServiceItem serviceItem={item} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
