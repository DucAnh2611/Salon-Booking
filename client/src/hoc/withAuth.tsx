"use client";

import useUser from "@/hook/useUser.hook";
import { ComponentType } from "react";

export default function withAuth<P extends object>(
    Component: ComponentType<P>
) {
    const Wrapper = (props: P) => {
        const { me } = useUser();

        if (!me) {
            return <p>You are not login</p>;
        }

        return <Component {...props} />;
    };

    return Wrapper;
}
