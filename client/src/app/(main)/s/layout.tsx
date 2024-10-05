import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Chi tiết dịch vụ",
    description: "Chi tiết dịch vụ",
};

export default function ServiceLayout({ children }: { children: ReactNode }) {
    return <div className="flex flex-col min-h-full">{children}</div>;
}
