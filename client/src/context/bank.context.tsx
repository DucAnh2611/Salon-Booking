import { IBank } from "@/interface/bank.interface";
import { ILayoutProps } from "@/interface/layout.interface";
import { bankList } from "@/lib/actions/bank.action";
import { createContext, useEffect, useState } from "react";

interface IBankContext {
    banks: IBank[];
    isLoading: boolean;
    isError: boolean;
}

export const BankContext = createContext<IBankContext>({
    banks: [],
    isError: false,
    isLoading: true,
});

export default function BankProvider({ children }: ILayoutProps) {
    const [banks, SetBanks] = useState<IBank[]>([]);
    const [isLoading, SetIsLoading] = useState<boolean>(true);
    const [isError, SetIsError] = useState<boolean>(false);

    const getBanks = async () => {
        SetIsLoading(true);
        const { response } = await bankList();

        if (response) {
            SetBanks(response.result);
            SetIsError(false);
        } else {
            SetIsError(true);
        }

        SetIsLoading(false);
    };

    useEffect(() => {
        getBanks();
    }, []);

    return (
        <BankContext.Provider value={{ banks, isLoading, isError }}>
            {children}
        </BankContext.Provider>
    );
}
