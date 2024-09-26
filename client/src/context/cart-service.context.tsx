"use client";

import { EOrderPaymentType } from "@/enum/order.enum";
import useDebounce from "@/hook/useDebounce.hook";
import { ICartService, ICartServiceAmount } from "@/interface/cart.interface";
import { ILayoutProps } from "@/interface/layout.interface";
import { IServiceItemCartBooking } from "@/interface/service.interface";
import { getServiceCartAmount } from "@/lib/actions/cart.action";
import { createContext, useEffect, useState } from "react";

interface ICartServiceContext {
    cart: ICartService | null;
    cartAmount: ICartServiceAmount;
    selectItems: IServiceItemCartBooking[];
    paymentType: EOrderPaymentType;
    loadingCartAmount: boolean;
    setCart: (cart: ICartService | null) => void;
    setSelectItems: (items: IServiceItemCartBooking[]) => void;
    setPaymentType: (type: EOrderPaymentType) => void;
}

export const CartServiceContext = createContext<ICartServiceContext>({
    cart: null,
    cartAmount: {
        tax: 0,
        cartAmount: 0,
        taxAmount: 0,
        total: 0,
    },
    selectItems: [],
    paymentType: EOrderPaymentType.CASH,
    loadingCartAmount: false,
    setCart: (cart: ICartService | null) => {},
    setSelectItems: (items: IServiceItemCartBooking[]) => {},
    setPaymentType: (type: EOrderPaymentType) => {},
});

export default function CartServiceProvider({ children }: ILayoutProps) {
    const [cart, SetCart] = useState<ICartService | null>(null);
    const [selectItems, SetSelectItems] = useState<IServiceItemCartBooking[]>(
        []
    );
    const [cartAmount, SetCartAmount] = useState<ICartServiceAmount>({
        tax: 0,
        cartAmount: 0,
        taxAmount: 0,
        total: 0,
    });
    const [paymentType, SetPaymentType] = useState<EOrderPaymentType>(
        EOrderPaymentType.CASH
    );
    const [isLoadingCartAmount, SetIsLoadingCartAmount] =
        useState<boolean>(false);

    const { debouncedValue, isDebouncing } =
        useDebounce<IServiceItemCartBooking[]>(selectItems);

    const setCart = (cart: ICartService | null) => {
        SetCart(cart);
    };

    const setSelectItems = (items: IServiceItemCartBooking[]) => {
        SetSelectItems(items);
    };

    const setPaymentType = (type: EOrderPaymentType) => {
        SetPaymentType(type);
    };

    useEffect(() => {
        const getAmount = async (
            cart: ICartService | null,
            items: IServiceItemCartBooking[]
        ) => {
            if (!cart) {
                SetCartAmount({
                    tax: 0,
                    cartAmount: 0,
                    taxAmount: 0,
                    total: 0,
                });
                return;
            }

            const { response } = await getServiceCartAmount({
                itemIds: items.map((product) => product.id),
                cartServiceId: cart.id,
            });
            SetIsLoadingCartAmount(false);
            if (response) {
                SetCartAmount(response.result);
            }
        };

        getAmount(cart, debouncedValue);
    }, [debouncedValue, cart]);

    useEffect(() => {
        if (isDebouncing) {
            SetIsLoadingCartAmount(isDebouncing);
        }
    }, [isDebouncing]);

    return (
        <CartServiceContext.Provider
            value={{
                cart,
                cartAmount,
                selectItems,
                paymentType,
                setPaymentType,
                setSelectItems,
                setCart,
                loadingCartAmount: isLoadingCartAmount,
            }}
        >
            {children}
        </CartServiceContext.Provider>
    );
}
