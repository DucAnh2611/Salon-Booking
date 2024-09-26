"use client";

import { CartServiceContext } from "@/context/cart-service.context";
import { useContext } from "react";

export default function useCartService() {
    return useContext(CartServiceContext);
}
