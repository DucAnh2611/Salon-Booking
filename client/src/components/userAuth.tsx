"use client";

import useUser from "@/hook/useUser.hook";
import { logout } from "@/lib/actions/auth.action";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "./ui/use-toast";
import UserAvatar from "./user-avatar";

export default function UserAuth() {
    const { me, handleLogout } = useUser();
    const search = useSearchParams();

    const handleLogoutBtn = async () => {
        const { response } = await logout();

        if (response) {
            handleLogout();
            toast({
                title: "Thành công",
                description: "Đăng xuất thành công",
            });
        }
    };

    if (!me)
        return (
            <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                    <Link href={"/signup?redirect=" + search.toString()}>
                        Tạo tài khoản
                    </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                    <Link href={"/login?redirect=" + search.toString()}>
                        Đăng nhập
                    </Link>
                </Button>
            </div>
        );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <div className="flex gap-2 items-center">
                    <div className="h-full flex flex-col">
                        <p className="text-xs font-bold text-right w-auto">
                            {me.userBase.lastname} {me.userBase.firstname}
                        </p>
                        <p className="text-xs  w-auto text-right">{me.email}</p>
                    </div>
                    <div className="size-10 ">
                        <UserAvatar user={me} />
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Button
                        asChild
                        className="w-full py-1.5 h-fit justify-start font-normal"
                        variant="ghost"
                    >
                        <Link href="/me">Quản lý tài khoản</Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        asChild
                        className="w-full py-1.5 h-fit justify-start font-normal"
                        variant="ghost"
                    >
                        <Link href="/order">Đơn hàng</Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Button
                        asChild
                        className="w-full py-1.5 h-fit justify-start font-normal"
                        variant="ghost"
                    >
                        <Link href="/cart">
                            Giỏ hàng
                            {me.cartProduct.length + me.cartService.length !==
                                0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute top-1/2 right-0 -translate-y-1/2 aspect-square p-0 size-4 flex items-center justify-center text-[10px]"
                                >
                                    {me.cartProduct.length +
                                        me.cartService.length}
                                </Badge>
                            )}
                        </Link>
                    </Button>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Button
                        variant="destructive"
                        className="w-full py-1.5 h-fit justify-start"
                        size="sm"
                        onClick={handleLogoutBtn}
                    >
                        Đăng xuất
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
