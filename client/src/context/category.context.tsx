"use client";

import { ICategory, ICategoryTree } from "@/interface/category.interface";
import { ILayoutProps } from "@/interface/layout.interface";
import { getCategoryTree } from "@/lib/actions/category.action";
import { createContext, useEffect, useState } from "react";

interface ICategoryContext {
    categoryTree: ICategory[];
}

export const CategoryContext = createContext<ICategoryContext>({
    categoryTree: [],
});

export default function CategoryProvider({ children }: ILayoutProps) {
    const [categoryTree, SetCategoryTree] = useState<ICategoryTree[]>([]);

    useEffect(() => {
        const getTree = async () => {
            const { response } = await getCategoryTree();
            if (response) {
                SetCategoryTree(response.result);
            } else {
                SetCategoryTree([]);
            }
        };

        getTree();
    }, []);

    return (
        <CategoryContext.Provider value={{ categoryTree }}>
            {children}
        </CategoryContext.Provider>
    );
}
