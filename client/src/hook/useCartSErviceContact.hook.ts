import { CartServiceContactContext } from "@/context/cart-service-contact.context";
import { useContext } from "react";

export default function useCartServiceContact() {
    return useContext(CartServiceContactContext);
}
