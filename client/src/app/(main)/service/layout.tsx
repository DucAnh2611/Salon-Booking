import SearchServiceContextProvider from "@/context/search-service.context";
import { ILayoutProps } from "@/interface/layout.interface";
import { Metadata } from "next";
import { ReactNode } from "react";

interface IProductLayoutProps extends ILayoutProps {
    filter: ReactNode;
}

export const metadata: Metadata = {
    title: "Tìm kiếm dịch vụ",
    description: "Tìm kiếm dịch vụ",
};
export default function Layout({ children, filter }: IProductLayoutProps) {
    return (
        <SearchServiceContextProvider>
            <section className="w-full py-10 h-fit relative ">
                <div className="container px-4 md:px-6 grid grid-cols-8 gap-6 h-fit relative">
                    <div className="col-span-2">{filter}</div>
                    <div className="col-span-6">{children}</div>
                </div>
            </section>
        </SearchServiceContextProvider>
    );
}
