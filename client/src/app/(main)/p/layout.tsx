import { Metadata } from "next";
import { ReactNode } from "react";

export const metadata: Metadata = {
    title: "Chi tiết sản phẩm",
    description: "Chi tiết sản phẩm",
};

export default function ProductLayout({ children }: { children: ReactNode }) {
    return <div className="flex flex-col min-h-full">{children}</div>;
}
