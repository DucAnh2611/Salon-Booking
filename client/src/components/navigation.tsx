"use client";

import { ScissorsIcon } from "lucide-react";
import Link from "next/link";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import UserAuth from "./userAuth";

export default function Navigation() {
    return (
        <nav className="w-full h-fit box-border border-b z-10 bg-background">
            <div className="container px-4 py-3 flex items-center justify-between ">
                <div className="flex gap-10 items-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2"
                        prefetch={false}
                    >
                        <ScissorsIcon className="size-5" />
                        <span className="text-base font-bold">My Salon</span>
                    </Link>
                    <nav className="ml-auto flex gap-0 items-center flex-1">
                        <Button variant="ghost" asChild>
                            <Link
                                href="#"
                                className="text-sm font-medium underline-offset-4"
                                prefetch={false}
                            >
                                Sản phẩm
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link
                                href="#"
                                className="text-sm font-medium underline-offset-4"
                                prefetch={false}
                            >
                                Dịch vụ
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link
                                href="#"
                                className="text-sm font-medium underline-offset-4"
                                prefetch={false}
                            >
                                Về chúng tôi
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link
                                href="#"
                                className="text-sm font-medium underline-offset-4"
                                prefetch={false}
                            >
                                Liên hệ
                            </Link>
                        </Button>
                    </nav>
                </div>
                <div className="flex gap-2 items-center">
                    <UserAuth />
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
}
