"use client";

import useCartProduct from "@/hook/useCartProduct.hook";
import OrderProductItem from "./order-product-item";

interface IOrderProductItemTabProps {}

export default function OrderProductItemTab({}: IOrderProductItemTabProps) {
    const { selectItems } = useCartProduct();
    if (!selectItems) return <p>Danh sách mua hàng trống</p>;

    return (
        <div>
            <div className="flex flex-col w-full h-fit gap-2">
                {selectItems.map((productItem) => (
                    <div key={productItem.id} className="border">
                        <OrderProductItem productItem={productItem} />
                    </div>
                ))}
            </div>
        </div>
    );
}
