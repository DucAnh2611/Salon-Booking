import GridPattern from "@/components/magicui/grid-pattern";
import SparklesText from "@/components/ui/sparkles-text";
import { cn } from "@/lib/utils";
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
                        <SparklesText
                            className="text-3xl !font-bold tracking-tighter sm:text-5xl"
                            sparklesCount={5}
                            colors={{
                                first: "hsl(var(--primary))",
                                second: "hsl(var(--primary))",
                            }}
                            text="
                            Dịch vụ nổi bật"
                        />
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

            <GridPattern
                width={50}
                height={50}
                x={-1}
                y={-1}
                className={cn(
                    "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] z-[-1]"
                )}
            />
        </section>
    );
}
