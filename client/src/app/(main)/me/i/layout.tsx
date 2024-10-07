import { ILayoutProps } from "@/interface/layout.interface";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Thông tin cá nhân",
    description: "Thông tin cá nhân của tôi",
};

export default function Layout({ children }: ILayoutProps) {
    return <>{children}</>;
}
