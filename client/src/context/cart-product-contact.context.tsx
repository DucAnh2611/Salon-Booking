import { IContactCart } from "@/interface/cart.interface";
import { ILayoutProps } from "@/interface/layout.interface";
import { createContext, useState } from "react";

interface ICartContactContext {
    contact: IContactCart;
    setContact: (ct: IContactCart) => void;
}

export const CartProductContactContext = createContext<ICartContactContext>({
    contact: {
        address: {
            district: null,
            province: null,
            street: "",
            ward: null,
        },
        name: "",
        phone: "",
        note: " ",
    },
    setContact: (ct: IContactCart) => {},
});

export default function CartProductContactProvider({ children }: ILayoutProps) {
    const [contact, SetContact] = useState<IContactCart>({
        address: {
            district: null,
            province: null,
            street: "",
            ward: null,
        },
        name: "",
        phone: "",
        note: " ",
    });
    const setContact = (ct: IContactCart) => {
        SetContact(ct);
    };

    return (
        <CartProductContactContext.Provider value={{ contact, setContact }}>
            {children}
        </CartProductContactContext.Provider>
    );
}
