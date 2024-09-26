"use client";

import useCartProduct from "@/hook/useCartProduct.hook";

export default function CartAmountPage() {
    const { cartAmount } = useCartProduct();

    return <p>Amount</p>;
}
