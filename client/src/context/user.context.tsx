"use client";

import { IUserClient } from "@/interface/user.interface";
import { meApi } from "@/lib/actions/auth.action";
import { isAuthenticated } from "@/lib/auth";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

interface IUserClientContext {
    me: IUserClient | null;
    handleLogout: () => void;
    handleLogin: () => void;
}

export const UserClientContext = createContext<IUserClientContext>({
    me: null,
    handleLogout: () => {},
    handleLogin: () => {},
});

export default function UserClientProvider({ children }: PropsWithChildren) {
    const [me, SetMe] = useState<IUserClient | null>(null);
    const [isLogin, SetIsLogin] = useState<boolean>(false);

    const getMe = async () => {
        const isAuth = await isAuthenticated();
        if (isAuth && !me) {
            const { response } = await meApi();
            if (response && response.result) {
                SetMe(response.result);
                SetIsLogin(true);
            } else {
                SetMe(null);
                SetIsLogin(false);
            }
        }
    };

    const handleLogout = () => {
        SetMe(null);
        SetIsLogin(false);
    };

    const handleLogin = () => {
        SetIsLogin(true);
    };

    useEffect(() => {
        getMe();
    }, [isLogin]);

    return (
        <UserClientContext.Provider value={{ me, handleLogout, handleLogin }}>
            {children}
        </UserClientContext.Provider>
    );
}
