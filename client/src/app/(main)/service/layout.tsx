import CategoryProvider from "@/context/category.context";
import SearchServiceContextProvider from "@/context/search-service.context";
import { ILayoutProps } from "@/interface/layout.interface";
import { ReactNode } from "react";

interface IProductLayoutProps extends ILayoutProps {
    filter: ReactNode;
}

export default function Layout({ children, filter }: IProductLayoutProps) {
    return (
        <CategoryProvider>
            <SearchServiceContextProvider>
                <section className="w-full py-10 h-fit relative ">
                    <div className="container px-4 md:px-6 grid grid-cols-7 gap-6 h-fit relative">
                        <div className="col-span-2">{filter}</div>
                        <div className="col-span-5">{children}</div>
                    </div>
                </section>
            </SearchServiceContextProvider>
        </CategoryProvider>
    );
}
