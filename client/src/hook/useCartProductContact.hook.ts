import { CartProductContactContext } from "@/context/cart-product-contact.context";
import { useContext } from "react";

export default function useCartProductContact() {
    return useContext(CartProductContactContext);
}
