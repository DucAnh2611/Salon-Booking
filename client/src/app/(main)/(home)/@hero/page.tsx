import { FadeText } from "@/components/magicui/fade-text";
import GridPattern from "@/components/magicui/grid-pattern";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function HomeHero() {
    return (
        <section className="w-full py-32 relative ">
            <div className="container px-4 md:px-6">
                <div className="flex gap-12">
                    <div className="flex flex-col justify-center space-y-4 flex-1">
                        <div className="space-y-4">
                            <FadeText
                                className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
                                direction="right"
                                framerProps={{
                                    show: { transition: { delay: 0 } },
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
                            <Link
                                href="/service"
                                className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                prefetch={false}
                            >
                                Đặt lịch ngay
                            </Link>
                            <Link
                                href="/product"
                                className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                                prefetch={false}
                            >
                                Mua sản phẩm
                            </Link>
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
                    "[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] z-[-1]"
                )}
            />
        </section>
    );
}
