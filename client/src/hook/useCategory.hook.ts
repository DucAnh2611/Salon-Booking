"use client";

import { CategoryContext } from "@/context/category.context";
import { useContext } from "react";

export default function useCategory() {
    return useContext(CategoryContext);
}
