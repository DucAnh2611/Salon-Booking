"use client";

import { ESocketEvent, ESocketMessage } from "@/enum/socket.enum";
import useSocket from "@/hook/useSocket.hook";
import { IOrganization } from "@/interface/organization.interface";
import { currentOrganization } from "@/lib/actions/organization.action";
import { api_media_url } from "@/lib/apiCall";
import { joinString } from "@/lib/string";
import { ScissorsIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import MediaLoader from "./media-load";
import { ModeToggle } from "./theme-toggle";
import { Button } from "./ui/button";
import UserAuth from "./userAuth";

export default function Navigation() {
    const [organization, SetOrganization] = useState<IOrganization | null>(
        null
    );

    const search = useSearchParams();

    const { socket, isConnected } = useSocket();

    const getOrganization = async () => {
        const { response } = await currentOrganization();

        if (response) {
            SetOrganization(response.result);
            if (response.result && response.result.logo) {
                const link = document.querySelector('link[rel="icon"]');
                if (link) {
                    link.setAttribute(
                        "href",
                        joinString({
                            joinString: "",
                            strings: [api_media_url, response.result.logo.path],
                        })
                    );
                }
            }
        }
    };

    useEffect(() => {
        getOrganization();
    }, []);

    useEffect(() => {
        if (!socket || !isConnected) return;

        if (socket) {
            socket.emit(ESocketMessage.CLIENT_JOIN_HOST, {});

            socket.on(ESocketEvent.UPDATE_CURRENT_ORGANIZATION, () => {
                getOrganization();
            });
            return () => {
                socket.off(ESocketEvent.UPDATE_CURRENT_ORGANIZATION);
            };
        }
    }, [socket, isConnected]);

    useEffect(() => {
        if (organization && organization.logo) {
            const link = document.querySelector('link[rel="icon"]');
            if (link) {
                link.setAttribute(
                    "href",
                    joinString({
                        joinString: "",
                        strings: [api_media_url, organization.logo.path],
                    })
                );
            }
        }
    }, [search, organization]);

    return (
        <nav className="w-full h-fit box-border border-b z-10 bg-background sticky top-0 left-0">
            <div className="container px-4 py-3 flex items-center justify-between gap-5 ">
                <div className="flex gap-10 items-center">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2"
                        prefetch={false}
                    >
                        {organization ? (
                            <Fragment>
                                <div className="size-5 overflow-hidden">
                                    <MediaLoader media={organization.logo} />
                                </div>
                                <span className="text-base font-bold">
                                    {organization.name}
                                </span>
                            </Fragment>
                        ) : (
                            <Fragment>
                                <ScissorsIcon className="size-5" />
                                <span className="text-base font-bold">
                                    My Salon
                                </span>
                            </Fragment>
                        )}
                    </Link>
                    <nav className="ml-auto flex gap-0 items-center flex-1">
                        <Button variant="ghost" asChild>
                            <Link
                                href="/product"
                                className="text-sm font-medium underline-offset-4"
                                prefetch={true}
                            >
                                Sản phẩm
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link
                                href="/service"
                                className="text-sm font-medium underline-offset-4"
                                prefetch={true}
                            >
                                Dịch vụ
                            </Link>
                        </Button>
                        <Button variant="ghost" asChild>
                            <Link
                                href="/about-us"
                                className="text-sm font-medium underline-offset-4"
                                prefetch={true}
                            >
                                Về chúng tôi
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
