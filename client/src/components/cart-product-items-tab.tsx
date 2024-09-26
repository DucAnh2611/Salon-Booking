"use client";

import useCartProduct from "@/hook/useCartProduct.hook";
import { IProductItemCart } from "@/interface/product.interface";
import { updateProductCart } from "@/lib/actions/cart.action";
import { CheckedState } from "@radix-ui/react-checkbox";
import { LoaderCircle, Trash } from "lucide-react";
import { useState } from "react";
import DialogDeleteItemProductCart from "./dialog-delete-item-product-cart";
import QuantityButton from "./quantity-button";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";

interface ICartProductItemTabProps {}

export default function CartProductItemTab({}: ICartProductItemTabProps) {
    const { selectItems, cart, setSelectItems, setCart } = useCartProduct();

    const [loading, SetLoading] = useState<boolean>(false);

    if (!cart) return <p>Giở hàng trống</p>;

    const handleSelectItems =
        (item: IProductItemCart) => (check: CheckedState) => {
            setSelectItems(
                !check
                    ? selectItems.filter((i) => i.id !== item.id)
                    : [...selectItems, item]
            );
        };

    const selectAll = (check: CheckedState) => {
        if (!cart.products.length) return;
        setSelectItems(
            check
                ? cart.products.filter(
                      (p) =>
                          !p.product.deletedAt ||
                          (p.productType &&
                              !p.product.deletedAt &&
                              !p.productType.deletedAt)
                  )
                : []
        );
    };

    const isItemSelect = (i: IProductItemCart) => {
        let isSelectedAll = false;
        for (const item of selectItems) {
            if (item.id === i.id) {
                isSelectedAll = true;
                break;
            }
        }
        return isSelectedAll;
    };

    const isSelectAll = () => {
        if (
            selectItems.length !== cart.products.length ||
            !cart.products.length
        )
            return false;

        let isSelectedAll = true;
        for (const item of selectItems) {
            if (!cart.products.find((i) => i.id === item.id)) {
                isSelectedAll = false;
                break;
            }
        }

        return isSelectedAll;
    };

    const handleChangeQuantity =
        (item: IProductItemCart) => async (quantity: number) => {
            SetLoading(true);

            const { response, error } = await updateProductCart({
                id: item.id,
                quantity: quantity,
            });

            if (!error) {
                setCart({
                    ...cart,
                    products: cart.products.map((p) =>
                        p.id === item.id ? { ...p, quantity: quantity } : p
                    ),
                });
                setSelectItems(
                    selectItems.map((i) =>
                        item.id === i.id ? { ...i, quantity: quantity } : i
                    )
                );
                toast({
                    title: "Cập nhật thành công",
                    description: "Cập nhật giỏ hàng thành công",
                    duration: 1000,
                });
            } else {
                toast({
                    title: "Cập nhật thất bại",
                    description: error.message,
                    variant: "destructive",
                    duration: 1000,
                });
            }

            SetLoading(false);
        };

    return (
        <div className="w-full h-fit relative">
            <div className="flex gap-2 w-full box-border py-4">
                <Checkbox
                    id="select-all-cart-product"
                    checked={isSelectAll()}
                    onCheckedChange={selectAll}
                />
                <Label htmlFor="select-all-cart-product">Chọn tất cả</Label>
            </div>
            <div className="flex flex-col w-full h-fit gap-2">
                {cart.products.map((productItem) => (
                    <div key={productItem.id} className="border">
                        <div className="flex justify-between w-full border-b p-3 box-border py-4">
                            <div className="flex gap-2 items-center">
                                <Checkbox
                                    disabled={
                                        !!productItem.product.deletedAt ||
                                        (productItem.productType &&
                                            !!productItem.productType.deletedAt)
                                    }
                                    id={productItem.id}
                                    checked={isItemSelect(productItem)}
                                    onCheckedChange={handleSelectItems(
                                        productItem
                                    )}
                                />
                                <Label htmlFor={productItem.id}>
                                    {productItem.product.name}
                                </Label>
                            </div>
                            <div>
                                <DialogDeleteItemProductCart
                                    trigger={
                                        <Button
                                            className="gap-2 "
                                            variant="destructive"
                                        >
                                            <Trash size={15} /> Xóa
                                        </Button>
                                    }
                                    item={productItem}
                                />
                            </div>
                        </div>
                        <div className="p-3 box-border w-full ">
                            <div>Product Id: {productItem.product.id}</div>
                            {productItem.productType && (
                                <div>
                                    Product Type Id:{" "}
                                    {productItem.productType.id}
                                </div>
                            )}
                            {!!productItem.product.deletedAt ||
                            (productItem.productType &&
                                !!productItem.productType.deletedAt) ? (
                                <div className="flex justify-end">
                                    <p className="text-sm text-destructive">
                                        Sản phẩm đã hoặc kiểu loại sản phẩm đã
                                        bị xóa
                                    </p>
                                </div>
                            ) : (
                                <div className="flex justify-end">
                                    <QuantityButton
                                        value={productItem.quantity}
                                        onChange={handleChangeQuantity(
                                            productItem
                                        )}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            {loading && (
                <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center z-[1] before:w-full before:h-full before:absolute before:top-0 before:left-0 before:bg-muted before:opacity-50 backdrop-blur-sm before:z-[0]">
                    <div className="flex gap-2 items-center h-fit z-[1]">
                        <LoaderCircle size={15} className="animate-spin" />
                        <p className="text-sm">Đang tải</p>
                    </div>
                </div>
            )}
        </div>
    );
}
