"use client";

import { IUserClient } from "@/interface/user.interface";
import { meApi } from "@/lib/actions/auth.action";
import { isAuthenticated } from "@/lib/auth";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

interface IUserClientContext {
    me: IUserClient | null;
    handleLogout: () => void;
}

export const UserClientContext = createContext<IUserClientContext>({
    me: null,
    handleLogout: () => {},
});

export default function UserClientProvider({ children }: PropsWithChildren) {
    const [me, SetMe] = useState<IUserClient | null>(null);

    const getMe = async () => {
        const isAuth = await isAuthenticated();
        if (isAuth && !me) {
            const { response } = await meApi();
            if (response && response.result) {
                SetMe(response.result);
            } else {
                SetMe(null);
            }
        }
    };

    const handleLogout = () => {
        SetMe(null);
    };

    useEffect(() => {
        getMe();
    }, []);

    return (
        <UserClientContext.Provider value={{ me, handleLogout }}>
            {children}
        </UserClientContext.Provider>
    );
}
