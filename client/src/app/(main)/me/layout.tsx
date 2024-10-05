import MeNavigation from "@/components/me-nav";
import { ILayoutProps } from "@/interface/layout.interface";
import { Metadata } from "next";

interface ILayoutMeProps extends ILayoutProps {}

export const metadata: Metadata = {
    title: "Thông tin cá nhân",
    description: "Thông tin cá nhân",
};
export default function LayoutMe({ children }: ILayoutMeProps) {
    return (
        <section className="w-full py-5 relative bg-accent dark:bg-background flex-1 min-h-full">
            <div className="container px-4 grid grid-cols-5 gap-3">
                <div className="col-span-1 bg-background dark:bg-transparent dark:border rounded-sm box-border p-3 h-fit">
                    <MeNavigation />
                </div>
                <div className="col-span-4 bg-background dark:bg-transparent dark:border rounded-sm box-border p-5 relative">
                    {children}
                </div>
            </div>
        </section>
    );
}
