"use client";

import { CartProductContext } from "@/context/cart-product.context";
import { useContext } from "react";

export default function useCartProduct() {
    return useContext(CartProductContext);
}
