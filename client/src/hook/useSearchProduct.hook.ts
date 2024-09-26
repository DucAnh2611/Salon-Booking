"use client";

import { SearchProductContext } from "@/context/search-product.context";
import { useContext } from "react";

export default function useSearchProduct() {
    return useContext(SearchProductContext);
}
