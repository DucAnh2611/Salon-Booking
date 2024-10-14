import { FadeText } from "@/components/magicui/fade-text";
import GridPattern from "@/components/magicui/grid-pattern";
import { Button } from "@/components/ui/button";
import Ripple from "@/components/ui/ripple";
import SparklesText from "@/components/ui/sparkles-text";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
    return (
        <section className="w-full py-32 relative ">
            <div className="container px-4 md:px-6 relative z-[1]">
                <div className="flex gap-12">
                    <div className="flex flex-col justify-center space-y-4 flex-1">
                        <div className="space-y-4">
                            <SparklesText
                                className="text-3xl !font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                                sparklesCount={15}
                                colors={{
                                    first: "hsl(var(--primary))",
                                    second: "hsl(var(--primary))",
                                }}
                                text="Nâng tầm vẻ đẹp của bạn tại My Salon"
                            />
                            <FadeText
                                className="max-w-[600px] text-muted-foreground md:text-xl"
                                direction="right"
                                framerProps={{
                                    show: { transition: { delay: 0 } },
                                }}
                                text="
                                Trải nghiệm dịch vụ chăm sóc tóc, da và móng tối
                                ưu tại salon sang trọng của chúng tôi. Hãy đặt
                                cuộc hẹn ngay hôm nay và để chúng tôi thay đổi
                                diện mạo của bạn."
                            />
                        </div>
                        <div className="flex flex-col gap-2 min-[400px]:flex-row">
                            <Button
                                asChild
                                className="shadow-lg shadow-primary"
                            >
                                <Link href="/service" prefetch={false}>
                                    Đặt lịch ngay
                                </Link>
                            </Button>
                            <Button variant={"outline"} asChild>
                                <Link href="/product" prefetch={false}>
                                    Mua sản phẩm
                                </Link>
                            </Button>
                        </div>
                    </div>
                    <div className="size-[600px] aspect-video overflow-hidden rounded-xl object-cover">
                        <Image
                            src={
                                "https://t4.ftcdn.net/jpg/06/02/79/61/360_F_602796134_sPM5fGEKATWlvcD7B4CB4fyCef9PojbL.jpg"
                            }
                            alt="headline"
                            width={600}
                            height={600}
                            priority
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>

            <GridPattern
                width={50}
                height={50}
                x={-1}
                y={-1}
                className={cn(
                    "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] z-[-1] dark:hidden"
                )}
            />
            <Ripple className="z-[0] hidden dark:block" />
        </section>
    );
}
