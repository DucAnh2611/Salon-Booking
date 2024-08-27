import useUser from "@/hook/useUser.hook";
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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import UserAvatar from "./user-avatar";

export default function UserAuth() {
    const { me } = useUser();
    const search = useSearchParams();

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
                        <p className="text-xs font-bold">
                            {me.userBase.lastname} {me.userBase.firstname}
                        </p>
                        <p className="text-xs">{me.email}</p>
                    </div>
                    <div className="size-10">
                        <UserAvatar user={me} />
                    </div>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Tra cứu đơn hàng</DropdownMenuItem>
                <HoverCard openDelay={0}>
                    <HoverCardTrigger className="w-full">
                        <DropdownMenuItem>
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
                        </DropdownMenuItem>
                    </HoverCardTrigger>
                    <HoverCardContent
                        side="right"
                        align="center"
                        className="w-auto p-2"
                    >
                        <div className="w-[120px] rounded-sm hover:bg-secondary px-2 py-2 flex justify-start cursor-default relative">
                            <p className="text-left w-full text-sm">Sản phẩm</p>
                            <Badge
                                variant="destructive"
                                className="absolute top-1/2 right-2 -translate-y-1/2 aspect-square p-0 size-4 flex items-center justify-center text-[10px]"
                            >
                                {me.cartProduct.length}
                            </Badge>
                        </div>
                        <div className="w-[120px] rounded-sm hover:bg-secondary px-2 py-2 flex justify-start cursor-default relative">
                            <p className="text-left w-full text-sm">Dịch vụ</p>
                            <Badge
                                variant="destructive"
                                className="absolute top-1/2 right-2 -translate-y-1/2 aspect-square p-0 size-4 flex items-center justify-center text-[10px]"
                            >
                                {me.cartService.length}
                            </Badge>
                        </div>
                    </HoverCardContent>
                </HoverCard>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Button
                        variant="destructive"
                        className="w-full py-1.5 h-fit justify-start"
                        size="sm"
                    >
                        Đăng xuất
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
