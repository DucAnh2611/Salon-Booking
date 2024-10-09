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
    resetFilter: () => void;
}

export const SearchProductContext = createContext<ISearchProductContext>({
    filter: {
        key: "",
        price: {
            from: 0,
        },
        categoryIds: [],
        page: 1,
        limit: 12,
        orderBy: "",
    },
    setFilter: <T extends keyof IApiSearchProduct>(
        key: T,
        value: IApiSearchProduct[T]
    ) => {},
    resetFilter: () => {},
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
        page: 1,
        limit: 12,
        orderBy: "",
    });

    const setFilter = <T extends keyof IApiSearchProduct>(
        key: T,
        value: IApiSearchProduct[T]
    ) => {
        SetFilter((f) => ({ ...f, page: 1, [key]: value }));
    };

    const resetFilter = () => {
        SetFilter({
            key: "",
            price: {
                from: 0,
            },
            categoryIds: [],
            page: 1,
            limit: 20,
        });
    };

    return (
        <SearchProductContext.Provider
            value={{ filter, setFilter, resetFilter }}
        >
            {children}
        </SearchProductContext.Provider>
    );
}
