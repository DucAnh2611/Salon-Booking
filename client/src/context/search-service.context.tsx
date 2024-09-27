"use client";

import { ILayoutProps } from "@/interface/layout.interface";
import { IApiSearchService } from "@/interface/service.interface";
import { createContext, useState } from "react";

interface ISearchProductContext {
    filter: IApiSearchService;
    setFilter: <T extends keyof IApiSearchService>(
        key: T,
        value: IApiSearchService[T]
    ) => void;
}

export const SearchServiceContext = createContext<ISearchProductContext>({
    filter: {
        key: "",
        price: {
            from: 0,
        },
        categoryIds: [],
        page: 1,
        limit: 20,
        duration: {
            from: 0,
        },
    },
    setFilter: <T extends keyof IApiSearchService>(
        key: T,
        value: IApiSearchService[T]
    ) => {},
});

export default function SearchServiceContextProvider({
    children,
}: ILayoutProps) {
    const [filter, SetFilter] = useState<IApiSearchService>({
        key: "",
        price: {
            from: 0,
        },
        categoryIds: [],
        page: 1,
        limit: 20,
        duration: {
            from: 0,
        },
    });

    const setFilter = <T extends keyof IApiSearchService>(
        key: T,
        value: IApiSearchService[T]
    ) => {
        SetFilter((f) => ({ ...f, page: 1, [key]: value }));
    };

    return (
        <SearchServiceContext.Provider value={{ filter, setFilter }}>
            {children}
        </SearchServiceContext.Provider>
    );
}
