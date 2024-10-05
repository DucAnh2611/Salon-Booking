"use client";

import CartServiceAmount from "@/components/cart-amount-service";
import CartServiceItemTab from "@/components/cart-serivce-items-tab";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import useCartService from "@/hook/useCartService.hook";
import { getServiceCart } from "@/lib/actions/cart.action";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartServicePage() {
    const { setCart, cart, loadingCartAmount, selectItems } = useCartService();

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { response } = await getServiceCart();
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
    document.title = "Giỏ hàng dịch vụ";

    return (
        <div className="w-full flex gap-5">
            <Card className="h-fit flex-1 p-4 box-border">
                <CardHeader className="p-4">
                    <CardTitle>Giỏ hàng dịch vụ</CardTitle>
                </CardHeader>
                <Separator className="" orientation="horizontal" />
                <CardContent className="p-4 pt-0">
                    {loading && <p>Loading...</p>}
                    {error || (!cart && <p>error</p>)}
                    {cart && !cart.services.length && (
                        <div className="w-full h-full">
                            <p>Giở hàng không có sản phẩm nào</p>
                        </div>
                    )}
                    {cart && !!cart.services.length && <CartServiceItemTab />}
                </CardContent>
            </Card>

            <div className="w-[400px] h-auto">
                <div className="w-full h-fit flex-col flex gap-5 sticky top-5 left-0 ">
                    <CartServiceAmount />

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
                                <Link href={"checkout?type=service"}>
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
