import SparklesText from "@/components/ui/sparkles-text";
import { ReactNode, Suspense } from "react";
import LoadingProductMain from "./loading";

export default function ProductMainLayout({
    children: products,
}: {
    children: ReactNode;
}) {
    return (
        <section className="w-full py-32 relative h-auto bg-accent">
            <div className="container px-4 grid grid-flow-row gap-5">
                <div className="flex flex-col gap-3 w-full">
                    <div className="space-y-2 flex items-center flex-col w-full">
                        <SparklesText
                            className="text-3xl !font-bold tracking-tighter sm:text-5xl"
                            sparklesCount={5}
                            colors={{
                                first: "hsl(var(--primary))",
                                second: "hsl(var(--primary))",
                            }}
                            text="Sản phẩm nổi bật"
                        />
                        <p className="max-w-[900px] text-muted-foreground text-center">
                            Khám phá tuyển chọn các sản phẩm chăm sóc tóc, da và
                            móng cao cấp của chúng tôi để nâng cao thói quen làm
                            đẹp của bạn.
                        </p>
                    </div>
                </div>
                <Suspense fallback={<LoadingProductMain />}>
                    {products}
                </Suspense>
            </div>
        </section>
    );
}
