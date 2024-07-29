import { Separator } from "@/components/ui/separator";

export function HomeScreen() {
    document.title = "Trang chủ";
    return (
        <div className="w-full flex-1 flex items-center justify-center flex-col">
            <h1 className="text-[50px] font-bold">Salon Booking</h1>
            <p className="text-xl">Trang chủ trang quản lý</p>

            <Separator orientation="horizontal" className="w-1/2 my-1 mb-3" />

            <p className="text-sm">
                Chọn mục cần quản lý ở thanh công cụ bên trái
            </p>
        </div>
    );
}
