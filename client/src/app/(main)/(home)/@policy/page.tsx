import SparklesText from "@/components/ui/sparkles-text";
import { Banknote, CheckCircle2, CreditCard } from "lucide-react";
import { ReactNode } from "react";

export default function Page() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-accent">
            <div className="container px-4 md:px-6 mx-auto">
                <SparklesText
                    className="text-3xl !font-bold tracking-tighter sm:text-5xl w-full text-center"
                    sparklesCount={5}
                    colors={{
                        first: "hsl(var(--primary))",
                        second: "hsl(var(--primary))",
                    }}
                    text="
                    Chính sách của chúng tôi"
                />
                <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto mt-5">
                    Chúng tôi cam kết mang đến cho bạn trải nghiệm đặt chỗ suôn
                    sẻ và đáng tin cậy. Dưới đây là những chính sách chính được
                    thiết kế với sự hài lòng của bạn làm ưu tiên hàng đầu.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <PolicyCard
                        icon={
                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                        }
                        title="Trải Nghiệm Thực Tế"
                        description="Chúng tôi đảm bảo rằng tất cả các đặt chỗ đều dành cho những trải nghiệm thực tế, đã được xác minh. Những gì bạn thấy chính là những gì bạn sẽ nhận được - không có bất ngờ nào."
                    />
                    <PolicyCard
                        icon={
                            <CreditCard className="w-10 h-10 text-blue-500" />
                        }
                        title="Thanh Toán Trực Tuyến An Toàn"
                        description="Tận hưởng sự tiện lợi của thanh toán trực tuyến an toàn. Chúng tôi sử dụng mã hóa tiêu chuẩn công nghiệp để bảo vệ thông tin tài chính của bạn."
                    />
                    <div className="col-span-2 flex items-center justify-center">
                        <div className="w-1/2">
                            <PolicyCard
                                icon={
                                    <Banknote className="w-10 h-10 text-yellow-500" />
                                }
                                title="Chính Sách Hoàn Tiền Công Bằng"
                                description="Sự hài lòng của bạn là ưu tiên của chúng tôi. Nếu bạn không hài lòng với trải nghiệm của mình, chính sách hoàn tiền công bằng của chúng tôi sẽ bảo vệ bạn."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PolicyCard({
    icon,
    title,
    description,
}: {
    icon: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl dark:hover:shadow-primary duration-100 hover:-translate-y-2 bg-background dark:hover:shadow-2xl ">
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-xl font-semibold ml-4">{title}</h3>
            </div>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
