import { ORDER_TYPE } from "@/constants/order.constant";
import { ROUTER_PATH } from "@/constants/router.constant";
import { ESocketEvent, ESocketMessage } from "@/enum/socket.enum";
import useSocket from "@/hooks/useSocket";
import { ISocketOrderPlacedMessage } from "@/interface/socket/order.interface";
import { logoutApi, meApi } from "@/lib/redux/actions/auth.action";
import { myJob } from "@/lib/redux/actions/job.action";
import { authSelector, jobSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { api_media_url } from "@/utils/apiCall";
import { joinString } from "@/utils/string";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { LogOutIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import SheetMyJob from "../sheet-my-job";
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
    const { limit } = useAppSelector(jobSelector);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const { socket, isConnected } = useSocket();

    const handleLogout = () => {
        dispatch(logoutApi());
    };

    const playAudio = () => {
        if (audioRef.current) {
            const audio = audioRef.current;
            let resp = audio.play();

            if (resp !== undefined) {
                resp.then((_) => {
                    audio.play();
                }).catch((error) => {
                    //show error
                });
            }
        }
    };

    const viewDetail = (id: string) => () => {
        navigate(
            joinString({
                joinString: "/",
                strings: [ROUTER_PATH.ORDER, id],
            })
        );
    };

    useEffect(() => {
        if (authentication && !user && !isFailure) {
            dispatch(meApi());
        }
    }, [authentication]);

    useEffect(() => {
        if (!isConnected || !socket) return;

        if (socket) {
            socket.emit(ESocketMessage.EMPLOYEE_JOIN_HOST, {});

            socket.on(
                ESocketEvent.ORDER_PLACED,
                (data: ISocketOrderPlacedMessage) => {
                    if (
                        data.employeeIds.length &&
                        user &&
                        data.employeeIds.find((id) => id === user.id)
                    ) {
                        dispatch(myJob({ page: 1, limit }));
                    }

                    if (audioRef.current) {
                        toast(
                            joinString({
                                joinString: " ",
                                strings: [
                                    "Có",
                                    ORDER_TYPE[data.orderType],
                                    "mới",
                                ],
                            }),
                            {
                                description: joinString({
                                    joinString: " ",
                                    strings: [
                                        ORDER_TYPE[data.orderType],
                                        "Mã",
                                        data.orderCode,
                                    ],
                                }),
                                action: {
                                    label: "Chi tiết",
                                    onClick: viewDetail(data.orderId),
                                },
                            }
                        );
                        playAudio();
                    }
                }
            );

            return () => {
                socket.off(ESocketEvent.ORDER_PLACED);
            };
        }
    }, [socket, isConnected]);

    if (isCalling) return <p>Loading ...</p>;

    if (!user) {
        return <p>Loading...</p>;
    }

    return (
        <div className="w-full h-fit flex items-center justify-end gap-3">
            <div>
                <SheetMyJob trigger={<Button>Công việc của tôi</Button>} />
            </div>
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
            <audio ref={audioRef} src={"/assets/notification.wav"} />
        </div>
    );
}
