"use client";

import { EOrderType } from "@/enum/order.enum";
import { ILayoutProps } from "@/interface/layout.interface";
import { IOrderStateTracking } from "@/interface/order-state.interface";
import { IOrderTracking } from "@/interface/order.interface";
import { IProductOrderTracking } from "@/interface/product.interface";
import { IRefundTracking } from "@/interface/refund.interface";
import { IServiceOrderTracking } from "@/interface/service.interface";
import { ITransactionTracking } from "@/interface/transaction.interface";
import {
    trackingOrder,
    trackingOrderProduct,
    trackingOrderRefund,
    trackingOrderService,
    trackingOrderState,
    trackingOrderTransaction,
} from "@/lib/actions/order.action";
import { createContext, useEffect, useState } from "react";

interface TrackingDetailLoading {
    isLoading: boolean;
    isError: boolean;
}
type TTypeTracking = keyof Omit<
    IOrderTrackingContext,
    "setCode" | "reload" | "code"
>;

interface IOrderTrackingContext {
    order: IOrderTracking & TrackingDetailLoading;
    state: IOrderStateTracking & TrackingDetailLoading;
    refund: IRefundTracking & TrackingDetailLoading;
    transaction: ITransactionTracking & TrackingDetailLoading;
    product: IProductOrderTracking & TrackingDetailLoading;
    service: IServiceOrderTracking & TrackingDetailLoading;
    code: string;
    setCode: (code: string) => void;
    reload: (type: TTypeTracking) => void;
}

export const OrderTrackingContext = createContext<IOrderTrackingContext>({
    order: {
        order: null,
        isLoading: true,
        isError: false,
    },
    state: {
        states: [],
        isLoading: true,
        isError: false,
    },
    refund: {
        refunds: [],
        isLoading: true,
        isError: false,
    },
    transaction: {
        transactions: [],
        isLoading: true,
        isError: false,
    },
    product: {
        products: [],
        isLoading: true,
        isError: false,
    },
    service: {
        services: [],
        isLoading: true,
        isError: false,
    },
    code: "",
    setCode: (code: string) => {},
    reload: (type: TTypeTracking) => {},
});

export default function OrderTrackingProvider({ children }: ILayoutProps) {
    const [code, SetCode] = useState<string>("");
    const [order, SetOrder] = useState<IOrderTracking & TrackingDetailLoading>({
        order: null,

        isError: false,
        isLoading: false,
    });
    const [state, SetState] = useState<
        IOrderStateTracking & TrackingDetailLoading
    >({
        states: [],
        isError: false,
        isLoading: true,
    });
    const [refund, SetRefund] = useState<
        IRefundTracking & TrackingDetailLoading
    >({
        refunds: [],
        isError: false,
        isLoading: true,
    });
    const [transaction, SetTransaction] = useState<
        ITransactionTracking & TrackingDetailLoading
    >({
        transactions: [],
        isError: false,
        isLoading: true,
    });
    const [product, SetProduct] = useState<
        IProductOrderTracking & TrackingDetailLoading
    >({
        products: [],
        isError: false,
        isLoading: true,
    });
    const [service, SetService] = useState<
        IServiceOrderTracking & TrackingDetailLoading
    >({
        services: [],
        isError: false,
        isLoading: true,
    });

    const getOrder = async (code: string) => {
        SetOrder((order) => ({
            ...order,
            isError: false,
            isLoading: true,
        }));

        const { response } = await trackingOrder(code);

        if (response) {
            SetOrder({
                order: response.result,
                isError: false,
                isLoading: false,
            });
        } else {
            SetOrder({
                order: null,
                isError: true,
                isLoading: false,
            });
        }
    };

    const getRefund = async (id: string) => {
        SetRefund((r) => ({ ...r, isError: false, isLoading: true }));
        const { response } = await trackingOrderRefund(id);

        if (response) {
            SetRefund({
                refunds: response.result,
                isError: false,
                isLoading: false,
            });
        } else {
            SetRefund({
                refunds: [],
                isError: true,
                isLoading: false,
            });
        }
    };

    const getProduct = async (id: string) => {
        SetProduct((p) => ({
            ...p,
            isError: false,
            isLoading: true,
        }));
        const { response } = await trackingOrderProduct(id);

        if (response) {
            SetProduct({
                products: response.result,
                isError: false,
                isLoading: false,
            });
        } else {
            SetProduct({
                products: [],
                isError: true,
                isLoading: false,
            });
        }
    };

    const getService = async (id: string) => {
        SetService((p) => ({
            ...p,
            isError: false,
            isLoading: true,
        }));
        const { response } = await trackingOrderService(id);

        if (response) {
            SetService({
                services: response.result,
                isError: false,
                isLoading: false,
            });
        } else {
            SetService({
                services: [],
                isError: true,
                isLoading: false,
            });
        }
    };

    const getTransaction = async (id: string) => {
        SetTransaction((t) => ({
            ...t,
            isLoading: true,
            isError: false,
        }));

        const { response } = await trackingOrderTransaction(id);
        if (response) {
            SetTransaction({
                transactions: response.result,
                isLoading: false,
                isError: false,
            });
        } else {
            SetTransaction({
                transactions: [],
                isLoading: false,
                isError: true,
            });
        }
    };

    const getState = async (id: string) => {
        SetState((state) => ({
            ...state,
            isError: false,
            isLoading: true,
        }));

        const { response } = await trackingOrderState(id);

        if (response) {
            SetState({
                states: response.result,
                isError: false,
                isLoading: false,
            });
        } else {
            SetState({
                states: [],
                isError: true,
                isLoading: false,
            });
        }
    };

    const setCode = (code: string) => {
        SetCode(code);
    };

    const reload = async (type: TTypeTracking) => {
        if (!order.order) return;

        let func = undefined;
        switch (type) {
            case "order":
                await getOrder(code);
                return;
            case "state":
                func = getState;
                break;
            case "refund":
                func = getRefund;
                break;
            case "transaction":
                func = getTransaction;
                break;
            case "product":
                func = getProduct;
                break;
            case "service":
                func = getService;
                break;
            default:
                return;
        }
        if (func) {
            await func(order.order.id);
        }
    };

    useEffect(() => {
        if (code && code.length) {
            getOrder(code);
        }
    }, [code]);

    useEffect(() => {
        if (order.order) {
            const { id } = order.order;

            getRefund(id);
            getTransaction(id);
            getState(id);

            if (order.order.type === EOrderType.PRODUCT) {
                getProduct(id);
            } else if (order.order.type === EOrderType.SERVICE) {
                getService(id);
            }
        }
    }, [order.order]);

    return (
        <OrderTrackingContext.Provider
            value={{
                order,
                state,
                refund,
                product,
                transaction,
                service,
                code,
                setCode,
                reload,
            }}
        >
            {children}
        </OrderTrackingContext.Provider>
    );
}
