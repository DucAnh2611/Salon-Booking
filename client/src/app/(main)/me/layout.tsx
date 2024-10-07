import MeNavigation from "@/components/me-nav";
import withAuth from "@/hoc/withAuth";
import { ILayoutProps } from "@/interface/layout.interface";

interface ILayoutMeProps extends ILayoutProps {}
function Layout({ children }: ILayoutMeProps) {
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

export default withAuth(Layout);
