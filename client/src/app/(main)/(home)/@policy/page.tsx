import { Banknote, CheckCircle2, CreditCard, RefreshCcw } from "lucide-react";
import { ReactNode } from "react";

export default function Page() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-accent">
            <div className="container px-4 md:px-6 mx-auto">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8 capitalize">
                    Chính sách của chúng tôi
                </h2>
                <p className="text-xl text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">
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
                    <PolicyCard
                        icon={
                            <RefreshCcw className="w-10 h-10 text-purple-500" />
                        }
                        title="Thay Đổi Linh Hoạt"
                        description="Kế hoạch thay đổi, và chúng tôi hiểu điều đó. Bạn có thể dễ dàng thay đổi đặt chỗ của mình, tuân theo chính sách thay đổi linh hoạt của chúng tôi."
                    />
                    <PolicyCard
                        icon={
                            <Banknote className="w-10 h-10 text-yellow-500" />
                        }
                        title="Chính Sách Hoàn Tiền Công Bằng"
                        description="Sự hài lòng của bạn là ưu tiên của chúng tôi. Nếu bạn không hài lòng với trải nghiệm của mình, chính sách hoàn tiền công bằng của chúng tôi sẽ bảo vệ bạn."
                    />
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
        <div className="p-6 rounded-lg shadow-lg hover:shadow-xl duration-100 hover:-translate-y-2 bg-background dark:hover:shadow-2xl">
            <div className="flex items-center mb-4">
                {icon}
                <h3 className="text-xl font-semibold ml-4">{title}</h3>
            </div>
            <p className="text-muted-foreground">{description}</p>
        </div>
    );
}
