import { Button } from "@/components/ui/button";
import { ROUTER_PATH } from "@/constants/router.constant";
import { ArrowLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <h1 className="text-[60px] font-bold">404</h1>
            <p>Không có trang nào phù hợp với đường dẫn!</p>
            <Button variant="outline" asChild>
                <Link to={ROUTER_PATH.HOME} className="flex gap-2 items-center">
                    <ArrowLeftIcon size={17} /> <p>Quay lại trang chủ</p>
                </Link>
            </Button>
        </div>
    );
}
