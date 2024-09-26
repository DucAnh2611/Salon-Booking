"use client";

import { ILayoutProps } from "@/interface/layout.interface";
import { IApiSearchProduct } from "@/interface/product.interface";
import { createContext, useState } from "react";

interface ISearchProductContext {
    filter: IApiSearchProduct;
    setFilter: <T extends keyof IApiSearchProduct>(
        key: T,
        value: IApiSearchProduct[T]
    ) => void;
}

export const SearchProductContext = createContext<ISearchProductContext>({
    filter: {
        key: "",
        price: {
            from: 0,
        },
        categoryIds: [],
        page: 0,
        limit: 20,
    },
    setFilter: <T extends keyof IApiSearchProduct>(
        key: T,
        value: IApiSearchProduct[T]
    ) => {},
});

export default function SearchProductContextProvider({
    children,
}: ILayoutProps) {
    const [filter, SetFilter] = useState<IApiSearchProduct>({
        key: "",
        price: {
            from: 0,
        },
        categoryIds: [],
        page: 0,
        limit: 20,
    });

    const setFilter = <T extends keyof IApiSearchProduct>(
        key: T,
        value: IApiSearchProduct[T]
    ) => {
        SetFilter((f) => ({ ...f, [key]: value }));
    };

    return (
        <SearchProductContext.Provider value={{ filter, setFilter }}>
            {children}
        </SearchProductContext.Provider>
    );
}