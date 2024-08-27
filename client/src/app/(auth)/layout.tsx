"use client";

import { ScissorsIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <main className="w-full h-screen flex flex-col">
            <header className="w-full h-fit flex justify-between py-5 px-[200px] box-border bg-accent-foreground">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 text-background"
                    prefetch={false}
                >
                    <ScissorsIcon className="size-5" />
                    <span className="text-base font-bold">My Salon</span>
                </Link>
                <p className="text-background font-normal text-sm">
                    Trang web đặt lịch làm dịch vụ, mua sắm sản phẩm của cửa
                    hàng
                </p>
            </header>
            <div className="w-full flex-1 grid place-items-center">
                {children}
            </div>
        </main>
    );
}
