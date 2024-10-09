"use client";

import { ILayoutProps } from "@/interface/layout.interface";
import {
    IApiListOrder,
    IListOrderFilter,
    IListOrderOrder,
    IOrderSearch,
} from "@/interface/order.interface";
import { searchOrder } from "@/lib/actions/order.action";
import { isSameObject } from "@/lib/object";
import { createContext, useEffect, useState } from "react";

interface IOrderListContext {
    orders: IOrderSearch[];
    limit: number;
    page: number;
    count: number;
    filter: IListOrderFilter;
    order: IListOrderOrder;
    isLoading: boolean;
    isError: boolean;
    setSearchBody: (body: IApiListOrder) => void;
}

export const OrderListContext = createContext<IOrderListContext>({
    orders: [],
    limit: 8,
    page: 0,
    count: 0,
    filter: {},
    order: {},
    isLoading: false,
    isError: false,
    setSearchBody: (body: IApiListOrder) => {},
});

export default function OrderListProviver({ children }: ILayoutProps) {
    const [orders, SetOrders] = useState<IOrderSearch[]>([]);
    const [filter, SetFilter] = useState<IListOrderFilter>({});
    const [order, SetOrder] = useState<IListOrderOrder>({});
    const [page, SetPage] = useState<number>(1);
    const [count, SetCount] = useState<number>(0);
    const [limit, SetLimit] = useState<number>(8);
    const [isLoading, SetIsLoading] = useState<boolean>(false);
    const [isError, SetIsError] = useState<boolean>(false);

    const setSearchBody = async (body: IApiListOrder) => {
        if (
            (isSameObject(body.order, order) &&
                isSameObject(body.filter, filter)) ||
            body.page !== page
        ) {
            SetPage(body.page);
        } else {
            SetPage(1);
        }
        SetFilter(body.filter);
        SetOrder(body.order);
        SetLimit(body.limit);
    };
    const getSearchOrder = async (body: IApiListOrder) => {
        SetIsLoading(true);
        const { response } = await searchOrder(body);

        if (response) {
            SetOrders(response.result.items);
            SetCount(response.result.count);

            SetIsError(false);
        } else {
            SetOrders([]);
            SetIsError(true);
        }

        SetIsLoading(false);
    };

    useEffect(() => {
        getSearchOrder({ page, limit, order, filter });
    }, [page, limit, filter, order]);

    return (
        <OrderListContext.Provider
            value={{
                orders,
                filter,
                order,
                page,
                limit,
                count,
                isError,
                isLoading,
                setSearchBody,
            }}
        >
            {children}
        </OrderListContext.Provider>
    );
}
