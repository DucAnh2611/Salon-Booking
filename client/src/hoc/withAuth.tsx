"use client";

import useUser from "@/hook/useUser.hook";
import { NextPage } from "next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function withAuth(Component: NextPage) {
    const Wrapper = (props: any) => {
        const { me } = useUser();
        const router = useRouter();

        useEffect(() => {
            if (!me) {
                router.push("/login"); // Redirect to login if not authenticated
            }
        }, [me, router]);

        if (!me) {
            return null; // Optionally render a loading state or null
        }

        return <Component {...props} />;
    };

    return Wrapper;
}
