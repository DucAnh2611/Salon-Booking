import { EOrderType } from "@/enum/order.enum";
import { detailOrderProduct } from "@/lib/redux/actions/order-detail.action";
import { orderDetailSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useEffect } from "react";
import Failure from "./failure";
import Loading from "./loading";
import OrderDetailProductItem from "./order-detail-product-item";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";

export default function OrderDetailProductCard() {
    const {
        base: { base },
        product: { products, isCalling, isFailure },
    } = useAppSelector(orderDetailSelector);
    const dispatch = useAppDispatch();

    useEffect(() => {
        if (base && base.type === EOrderType.PRODUCT) {
            dispatch(detailOrderProduct(base.id));
        }
    }, [base]);

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle>Thông tin sản phẩm</CardTitle>
                <CardDescription>
                    Thông tin về sản phẩm tại thời gian đặt hàng
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full relative">
                {isCalling && <Loading />}
                {isFailure && <Failure />}
                <div className="space-y-2">
                    {products.map((item) => (
                        <div key={item.id}>
                            <OrderDetailProductItem productItem={item} />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
