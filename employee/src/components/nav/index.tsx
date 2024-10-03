import { logoutApi, meApi } from "@/lib/redux/actions/auth.action";
import { authSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { api_media_url } from "@/utils/apiCall";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function NavigationBar() {
    const { user, authentication, isCalling, isFailure } =
        useAppSelector(authSelector);
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logoutApi());
    };

    useEffect(() => {
        if (authentication && !user && !isFailure) {
            dispatch(meApi());
        }
    }, [authentication]);

    if (isCalling) return <p>Loading ...</p>;

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="w-full h-fit flex items-center justify-end gap-3">
            <div>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button
                            className="flex items-center h-fit py-2 px-3 gap-2"
                            variant="outline"
                        >
                            <p className="text-sm font-normal">
                                {user.username}
                            </p>
                            <Avatar className="h-[30px] w-[30px]">
                                <AvatarImage
                                    src={`${api_media_url}${user?.userBase.userAvatar?.path}`}
                                    alt={user.username}
                                />
                                <AvatarFallback className="font-semibold text-sm bg-primary">
                                    {user.userBase.lastname
                                        .charAt(0)
                                        .toUpperCase()}
                                    {user.userBase.firstname
                                        .charAt(0)
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end">
                        <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuRadioGroup>
                            <DropdownMenuItem>
                                <Button
                                    variant="destructive"
                                    className="gap-2 justify-start w-full"
                                    onClick={handleLogout}
                                >
                                    <LogOutIcon size={15} />
                                    <p>Đăng xuất</p>
                                </Button>
                            </DropdownMenuItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <Button>Công việc của tôi</Button>
            </div>
        </div>
    );
}
