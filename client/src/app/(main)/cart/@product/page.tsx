"use client";

import CartProductAmount from "@/components/cart-amount-product";
import CartProductItemTab from "@/components/cart-product-items-tab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCartProduct from "@/hook/useCartProduct.hook";
import { getProductCart } from "@/lib/actions/cart.action";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartProductPage() {
    const { setCart, cart, loadingCartAmount, selectItems } = useCartProduct();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { response } = await getProductCart();
                if (!response) {
                    setError(true);
                } else {
                    setCart(response.result);
                }
            } catch (error) {
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    document.title = "Giỏ hàng sản phẩm";

    return (
        <div className="w-full flex gap-5">
            <Card className="h-fit flex-1 p-4 box-border">
                <CardHeader className="p-4">
                    <CardTitle>Giỏ hàng sản phẩm</CardTitle>
                </CardHeader>
                <Separator className="" orientation="horizontal" />
                <CardContent className="p-4 pt-0">
                    {loading && <p>Loading...</p>}
                    {error || (!cart && <p>error</p>)}
                    {cart && !cart.products.length && (
                        <div className="w-full h-full">
                            <p>Giở hàng không có sản phẩm nào</p>
                        </div>
                    )}
                    {cart && !!cart.products.length && <CartProductItemTab />}
                </CardContent>
            </Card>

            <div className="w-[400px] h-auto">
                <div className="w-full h-fit flex-col flex gap-5 sticky top-5 left-0 ">
                    <CartProductAmount />

                    <div className="w-full flex gap-2">
                        <Button
                            className="w-full !py-3 h-fit text-base "
                            disabled={loadingCartAmount || !selectItems.length}
                            type="button"
                            asChild={
                                !(loadingCartAmount || !selectItems.length)
                            }
                        >
                            {loadingCartAmount || !selectItems.length ? (
                                <p>Thanh toán</p>
                            ) : (
                                <Link href={"checkout?type=product"}>
                                    Thanh toán
                                </Link>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
