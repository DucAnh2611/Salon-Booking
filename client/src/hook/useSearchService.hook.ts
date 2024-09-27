"use client";

import { SearchServiceContext } from "@/context/search-service.context";
import { useContext } from "react";

export default function useSearchService() {
    return useContext(SearchServiceContext);
}
