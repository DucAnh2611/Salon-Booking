import { ReactNode, Suspense } from "react";
import LoadingServiceMain from "./loading";

export default function ServiceMainLayout({
    children: services,
}: {
    children: ReactNode;
}) {
    return (
        <section className="w-full py-32 relative h-auto bg-transparent">
            <div className="container px-4 grid grid-flow-row gap-5">
                <div className="flex flex-col gap-3">
                    <div className="space-y-2 flex items-center flex-col w-full">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                            Dịch vụ nổi bật
                        </h2>
                        <p className="max-w-[900px] text-muted-foreground text-center">
                            Khám phá tuyển chọn các dịch vụ chăm sóc da, tóc,
                            nối mi.
                        </p>
                    </div>
                </div>
                <Suspense fallback={<LoadingServiceMain />}>
                    {services}
                </Suspense>
            </div>
        </section>
    );
}
