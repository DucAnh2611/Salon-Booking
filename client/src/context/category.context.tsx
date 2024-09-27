"use client";

import { ICategory } from "@/interface/category.interface";
import { ILayoutProps } from "@/interface/layout.interface";
import { getCategoryList } from "@/lib/actions/category.action";
import { createContext, useEffect, useState } from "react";

interface ICategoryContext {
    categoryTree: ICategory[];
}

export const CategoryContext = createContext<ICategoryContext>({
    categoryTree: [],
});

export default function CategoryProvider({ children }: ILayoutProps) {
    const [categoryTree, SetCategoryTree] = useState<ICategory[]>([]);

    useEffect(() => {
        const getTree = async () => {
            const { response } = await getCategoryList();
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
