"use client";

import { ESocketEvent, ESocketMessage } from "@/enum/socket.enum";
import useSocket from "@/hook/useSocket.hook";
import { IOrganization } from "@/interface/organization.interface";
import { currentOrganization } from "@/lib/actions/organization.action";
import { api_media_url } from "@/lib/apiCall";
import { joinString } from "@/lib/string";
import { Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Fragment, useEffect, useState } from "react";

export default function Footer() {
    const [organization, SetOrganization] = useState<IOrganization | null>(
        null
    );

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

    return (
        <footer className="bg-accent text-accent-foreground py-8 border-muted-foreground border-t">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">Về Chúng Tôi</h3>
                        <p className="text-sm">
                            Chúng tôi là một công ty chuyên cung cấp các dịch vụ
                            và sản phẩm xuất sắc cho khách hàng.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">
                            Liên Kết Nhanh
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    href="/"
                                    className="text-sm hover:text-primary duration-100"
                                >
                                    Trang Chủ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/service"
                                    className="text-sm hover:text-primary duration-100"
                                >
                                    Dịch Vụ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/product"
                                    className="text-sm hover:text-primary duration-100"
                                >
                                    Sản Phẩm
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">
                            Liên Hệ Chúng Tôi
                        </h3>
                        {organization ? (
                            <Fragment>
                                <p className="text-sm">
                                    {organization.address}
                                </p>
                                <p className="text-sm">
                                    Sđt: {organization.phone}
                                </p>
                                <p className="text-sm">
                                    Email: {organization.gmail}
                                </p>
                            </Fragment>
                        ) : (
                            <Fragment></Fragment>
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-lg mb-4">
                            Theo Dõi Chúng Tôi
                        </h3>
                        <div className="flex space-x-4">
                            {organization?.facebook && (
                                <Link
                                    href={organization.facebook}
                                    className="text-gray-600 hover:text-primary duration-100"
                                    target="_blank"
                                >
                                    <Facebook size={24} />
                                    <span className="sr-only">Facebook</span>
                                </Link>
                            )}
                            {organization?.zalo && (
                                <Link
                                    href={organization.zalo}
                                    className="text-gray-600 hover:text-primary duration-100"
                                    target="_blank"
                                >
                                    <Image
                                        alt="zalo"
                                        src={
                                            "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Icon_of_Zalo.svg/1200px-Icon_of_Zalo.svg.png"
                                        }
                                        width={100}
                                        height={100}
                                        className="h-[25px] w-[25px]"
                                    />
                                    <span className="sr-only">Twitter</span>
                                </Link>
                            )}
                            {organization?.instagram && (
                                <Link
                                    href={organization.instagram}
                                    className="text-gray-600 hover:text-primary duration-100"
                                    target="_blank"
                                >
                                    <Instagram size={24} />
                                    <span className="sr-only">Instagram</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
                <div className="mt-8 border-t border-gray-200 pt-8 text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} Tên Công Ty Của Bạn.
                        Đã đăng ký bản quyền.
                    </p>
                </div>
            </div>
        </footer>
    );
}
