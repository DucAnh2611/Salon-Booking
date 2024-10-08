import { ILayoutProps } from "@/interface/layout.interface";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Chi tiết sản phẩm",
};

export default function Layout({ children }: ILayoutProps) {
    return (
        <section className="w-full py-12 relative bg-accent dark:bg-background flex-1">
            <div className="lg:w-[1000px] mx-auto grid grid-flow-row gap-5">
                {children}
            </div>
        </section>
    );
}
