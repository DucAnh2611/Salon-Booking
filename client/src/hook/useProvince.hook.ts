"use client";

import { ProvinceContext } from "@/context/province.context";
import { useContext } from "react";

export default function useProvince() {
    return useContext(ProvinceContext);
}
