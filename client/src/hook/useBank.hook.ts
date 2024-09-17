import { BankContext } from "@/context/bank.context";
import { useContext } from "react";

export default function useBank() {
    return useContext(BankContext);
}
