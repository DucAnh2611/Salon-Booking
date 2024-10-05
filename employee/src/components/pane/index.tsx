import { listNavigate } from "@/constants/navigation.constant";
import { ROUTER_PATH } from "@/constants/router.constant";
import { ESocketEvent } from "@/enum/socket.enum";
import useSocket from "@/hooks/useSocket";
import { organizationCurrent } from "@/lib/redux/actions/organization.action";
import { organizationSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { api_media_url } from "@/utils/apiCall";
import { joinString } from "@/utils/string";
import { Scissors } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import SelectThemeDowndown from "../dropdown/select-theme";
import ItemNavigatePrimary from "../item-pane";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

export default function NavigationPage() {
    const dispatch = useAppDispatch();
    const { current, reload } = useAppSelector(organizationSelector);

    const { socket, isConnected } = useSocket();

    useEffect(() => {
        if (reload || !current) {
            dispatch(organizationCurrent());
        }
    }, [reload]);

    useEffect(() => {
        const link = document.querySelector('link[rel="icon"]');

        if (current && current.logo) {
            if (link) {
                link.setAttribute(
                    "href",
                    joinString({
                        joinString: "",
                        strings: [api_media_url, current.logo.path],
                    })
                );
            }
        } else {
            if (link) {
                link.setAttribute("href", "favicon.ico");
            }
        }
    }, [current]);

    useEffect(() => {
        if (!socket || !isConnected) return;
        if (socket) {
            socket.on(ESocketEvent.UPDATE_CURRENT_ORGANIZATION, () => {
                dispatch(organizationCurrent());
            });

            return () => {
                socket.off(ESocketEvent.UPDATE_CURRENT_ORGANIZATION);
            };
        }
    }, []);

    return (
        <Card className="w-full h-full rounded-none flex flex-col">
            <CardHeader className="h-fit p-4  bg-primary">
                <Button
                    variant="ghost"
                    className="text-lg font-bold gap-2 justify-start p-2 h-[50px] text-background hover:bg-transparent hover:text-background"
                    size="lg"
                    asChild
                >
                    <Link to={ROUTER_PATH.HOME}>
                        {current && current.logo ? (
                            <>
                                <img
                                    alt="organization_logo"
                                    src={joinString({
                                        joinString: "",
                                        strings: [
                                            api_media_url,
                                            current.logo.path,
                                        ],
                                    })}
                                    className="w-8 h-8 overflow-hidden object-cover"
                                />
                                <p>{current.name}</p>
                            </>
                        ) : (
                            <>
                                <Scissors size={18} />
                                Trang quản lý MySalon
                            </>
                        )}
                    </Link>
                </Button>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardContent className="flex-1 w-full flex flex-col p-4 overflow-y-auto gap-5">
                <div className="flex-1 flex flex-col overflow-hidden overflow-y-auto gap-2 ">
                    <ScrollArea className="pr-3">
                        {listNavigate.map((item) => (
                            <div key={Math.random() * new Date().getTime()}>
                                <ItemNavigatePrimary item={item} />
                            </div>
                        ))}
                    </ScrollArea>
                </div>
                <CardFooter className="p-0 w-full justify-end flex gap-2 text-foreground">
                    <SelectThemeDowndown />
                </CardFooter>
            </CardContent>
        </Card>
    );
}
