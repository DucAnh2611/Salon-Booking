import { ILayoutProps } from "@/interface/layout.interface";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Về chúng tôi",
    description: "về chúng tôi",
};

export default function Layout({ children }: ILayoutProps) {
    return <div>{children}</div>;
}
