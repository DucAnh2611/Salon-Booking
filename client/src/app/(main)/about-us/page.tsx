import { Button } from "@/components/ui/button";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Clock, Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function Page() {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                Về Chúng Tôi
            </h1>

            <div className="max-w-2xl mx-auto mb-12 text-center">
                <p className="text-lg mb-4">
                    Chào mừng bạn đến với chúng tôi! Chúng tôi tự hào là điểm
                    đến hàng đầu cho việc đặt lịch dịch vụ và mua sắm sản phẩm
                    chất lượng cao.
                </p>
                <p className="text-lg">
                    Với nhiều năm năm kinh nghiệm, chúng tôi cam kết mang đến
                    cho khách hàng trải nghiệm tuyệt vời nhất từ việc đặt lịch
                    cho đến khi nhận sản phẩm.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
                <Card>
                    <CardHeader>
                        <Clock className="w-10 h-10 mb-2 text-primary" />
                        <CardTitle className="capitalize">
                            Đặt lịch dễ dàng
                        </CardTitle>
                        <CardDescription>
                            Hệ thống đặt lịch trực tuyến tiện lợi, nhanh chóng
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <ShoppingBag className="w-10 h-10 mb-2 text-primary" />
                        <CardTitle className="capitalize">
                            Sản phẩm đa dạng
                        </CardTitle>
                        <CardDescription>
                            Nhiều lựa chọn sản phẩm chất lượng cao
                        </CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <Heart className="w-10 h-10 mb-2 text-primary" />
                        <CardTitle className="capitalize">
                            Chăm sóc khách hàng
                        </CardTitle>
                        <CardDescription>
                            Đội ngũ hỗ trợ tận tâm, chuyên nghiệp
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <div className="bg-muted p-8 rounded-lg text-center">
                <h2 className="text-2xl font-semibold mb-4">
                    Cam Kết Của Chúng Tôi
                </h2>
                <p className="mb-6">
                    Chúng tôi cam kết mang đến cho khách hàng trải nghiệm mua
                    sắm và dịch vụ tốt nhất. Sự hài lòng của bạn là động lực để
                    chúng tôi không ngừng cải thiện và phát triển.
                </p>
                <Button asChild>
                    <Link href={"/service"}>Đặt Lịch Ngay</Link>
                </Button>
            </div>
        </div>
    );
}
