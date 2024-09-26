"use client";

import { OrderListContext } from "@/context/order-list-context.context";
import { useContext } from "react";

export default function useOrderList() {
    return useContext(OrderListContext);
}
