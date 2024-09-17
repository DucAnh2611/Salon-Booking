"use client";

import useCartProduct from "@/hook/useCartProduct.hook";
import { Label } from "./ui/label";

interface IOrderProductItemTabProps {}

export default function OrderProductItemTab({}: IOrderProductItemTabProps) {
    const { selectItems } = useCartProduct();
    if (!selectItems) return <p>Danh sách mua hàng trống</p>;

    return (
        <div>
            <div className="flex flex-col w-full h-fit gap-2">
                {selectItems.map((productItem) => (
                    <div key={productItem.id} className="border">
                        <div className="flex gap-2 w-full border-b p-3 box-border py-4">
                            <Label>{productItem.product.name}</Label>
                        </div>
                        <div className="p-3 box-border w-full ">
                            <div>Product Id: {productItem.product.id}</div>
                            {productItem.productType && (
                                <div>
                                    Product Type Id:{" "}
                                    {productItem.productType.id}
                                </div>
                            )}
                            <div>Quantity: {productItem.quantity}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
