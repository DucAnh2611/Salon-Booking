import { IContactCartService } from "@/interface/cart.interface";
import { ILayoutProps } from "@/interface/layout.interface";
import { createContext, useState } from "react";

interface ICartServiceContactContext {
    contact: IContactCartService;
    setContact: (ct: IContactCartService) => void;
}

export const CartServiceContactContext =
    createContext<ICartServiceContactContext>({
        contact: {
            name: "",
            phone: "",
            note: " ",
        },
        setContact: (ct: IContactCartService) => {},
    });

export default function CartServiceContactProvider({ children }: ILayoutProps) {
    const [contact, SetContact] = useState<IContactCartService>({
        name: "",
        phone: "",
        note: " ",
    });
    const setContact = (ct: IContactCartService) => {
        SetContact(ct);
    };

    return (
        <CartServiceContactContext.Provider value={{ contact, setContact }}>
            {children}
        </CartServiceContactContext.Provider>
    );
}
