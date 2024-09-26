"use client";

import { EOrderPaymentType } from "@/enum/order.enum";
import useDebounce from "@/hook/useDebounce.hook";
import { ICartProduct, ICartProductAmount } from "@/interface/cart.interface";
import { ILayoutProps } from "@/interface/layout.interface";
import { IProductItemCart } from "@/interface/product.interface";
import { getProductCartAmount } from "@/lib/actions/cart.action";
import { createContext, useEffect, useState } from "react";

interface ICartContext {
    cart: ICartProduct | null;
    cartAmount: ICartProductAmount;
    selectItems: IProductItemCart[];
    paymentType: EOrderPaymentType;
    loadingCartAmount: boolean;
    setCart: (cart: ICartProduct | null) => void;
    setSelectItems: (items: IProductItemCart[]) => void;
    setPaymentType: (type: EOrderPaymentType) => void;
}

export const CartProductContext = createContext<ICartContext>({
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
    setCart: (cart: ICartProduct | null) => {},
    setSelectItems: (items: IProductItemCart[]) => {},
    setPaymentType: (type: EOrderPaymentType) => {},
});

export default function CartProductProvider({ children }: ILayoutProps) {
    const [cart, SetCart] = useState<ICartProduct | null>(null);
    const [selectItems, SetSelectItems] = useState<IProductItemCart[]>([]);
    const [cartAmount, SetCartAmount] = useState<ICartProductAmount>({
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
        useDebounce<IProductItemCart[]>(selectItems);

    const setCart = (cart: ICartProduct | null) => {
        SetCart(cart);
    };

    const setSelectItems = (items: IProductItemCart[]) => {
        SetSelectItems(items);
    };

    const setPaymentType = (type: EOrderPaymentType) => {
        SetPaymentType(type);
    };

    useEffect(() => {
        const getAmount = async (
            cart: ICartProduct | null,
            items: IProductItemCart[]
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

            const { response } = await getProductCartAmount({
                itemIds: items.map((product) => product.id),
                cartProductId: cart.id,
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
        <CartProductContext.Provider
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
        </CartProductContext.Provider>
    );
}
