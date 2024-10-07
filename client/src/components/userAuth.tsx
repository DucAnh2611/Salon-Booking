"use client";

import useUser from "@/hook/useUser.hook";
import { logout } from "@/lib/actions/auth.action";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";
import UserAvatar from "./user-avatar";

export default function UserAuth() {
    const { me, handleLogout } = useUser();
    const path = usePathname();

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
                    <Link href={"/signup?redirect=" + path}>Tạo tài khoản</Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                    <Link href={"/login?redirect=" + path}>Đăng nhập</Link>
                </Button>
            </div>
        );

    return (
        <div className="flex gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <div className="flex gap-2 items-center">
                        <div className="h-full flex flex-col">
                            <p className="text-xs font-bold text-right w-auto">
                                {me.userBase.lastname} {me.userBase.firstname}
                            </p>
                            <p className="text-xs  w-auto text-right">
                                {me.email}
                            </p>
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

            <Separator className="h-auto" orientation="vertical" />

            <div className="flex gap-2">
                <Button asChild className="" variant="default" size="icon">
                    <Link href="/cart">
                        <ShoppingCart size={15} />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
