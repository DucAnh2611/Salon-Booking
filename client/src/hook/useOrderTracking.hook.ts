"use client";

import { OrderTrackingContext } from "@/context/order-tracking.context";
import { useContext } from "react";

export default function useOrderTracking() {
    return useContext(OrderTrackingContext);
}
