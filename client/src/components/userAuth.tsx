"use client";

import useCartProduct from "@/hook/useCartProduct.hook";
import useCartService from "@/hook/useCartService.hook";
import useUser from "@/hook/useUser.hook";
import { logout } from "@/lib/actions/auth.action";
import { ShoppingBag, ShoppingCart, ShowerHead } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";
import UserAvatar from "./user-avatar";

export default function UserAuth() {
    const { me, handleLogout } = useUser();
    const path = usePathname();

    const { count: countService, getCount: getCountService } = useCartService();
    const { count: countProduct, getCount: getCountProduct } = useCartProduct();

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

    useEffect(() => {
        getCountProduct();
        getCountService();
    }, []);

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
                <div className="w-fit h-fit relative group">
                    <HoverCard openDelay={100} closeDelay={100}>
                        <HoverCardTrigger asChild>
                            <Button
                                asChild
                                className="relative z-0"
                                variant="outline"
                                size="icon"
                            >
                                <Link href="/cart">
                                    <ShoppingCart size={15} />
                                </Link>
                            </Button>
                        </HoverCardTrigger>
                        <HoverCardContent
                            side="bottom"
                            align="end"
                            className="min-w-none w-[150px]"
                        >
                            <div className="w-full flex flex-col gap-1">
                                <div className="w-full relative">
                                    <Button
                                        asChild
                                        className="w-full !py-2 gap-2 justify-start items-center"
                                        variant="ghost"
                                        size="sm"
                                    >
                                        <Link href="/cart?type=product">
                                            <ShoppingBag size={15} /> Sản phẩm
                                        </Link>
                                    </Button>
                                    {!!countProduct && (
                                        <div className="absolute top-0 left-0 z-[1] rounded-full h-[20px] w-[20px] flex items-center justify-center aspect-square p-1 bg-primary shadow-lg shadow-primary text-xs -translate-x-1/2 -translate-y-1/2 text-background">
                                            <span>{countProduct}</span>
                                        </div>
                                    )}
                                </div>
                                <div className="w-full relative">
                                    <Button
                                        asChild
                                        className="w-full !py-2 gap-2 justify-start items-center"
                                        variant="ghost"
                                        size="sm"
                                    >
                                        <Link href="/cart?type=service">
                                            <ShowerHead size={15} /> Dịch vụ
                                        </Link>
                                    </Button>
                                    {!!countService && (
                                        <div className="absolute top-0 left-0 z-[1] rounded-full h-[20px] w-[20px] flex items-center justify-center aspect-square p-1 bg-primary shadow-lg shadow-primary text-xs -translate-x-1/2 -translate-y-1/2 text-background">
                                            <span>{countService}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                    {!!(countProduct + countService) && (
                        <div className="absolute top-0 right-0 z-[1] rounded-full h-[20px] w-[20px] flex items-center justify-center aspect-square p-1 bg-primary shadow-lg shadow-primary text-xs translate-x-1/2 -translate-y-1/2 text-background">
                            <div className="w-full h-full absolute bg-primary rounded-full animate-ping top-0 left-0" />

                            <span>{countProduct + countService}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
