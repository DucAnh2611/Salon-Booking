import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProductPage() {
    return (
        <div className="w-full flex flex-col gap-3">
            <div className="w-full">
                <div className="flex gap-2">
                    <Input
                        className="focus-visible:ring-transparent"
                        placeholder="Từ khóa"
                    />
                    <Button>Tìm kiếm</Button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
                <div className="w-full h-[300px] bg-primary rounded"></div>
                <div className="w-full h-[300px] bg-primary rounded"></div>
                <div className="w-full h-[300px] bg-primary rounded"></div>
                <div className="w-full h-[300px] bg-primary rounded"></div>
                <div className="w-full h-[300px] bg-primary rounded"></div>
                <div className="w-full h-[300px] bg-primary rounded"></div>
                <div className="w-full h-[300px] bg-primary rounded"></div>
                <div className="w-full h-[300px] bg-primary rounded"></div>
                <div className="w-full h-[300px] bg-primary rounded"></div>
                <div className="w-full h-[300px] bg-primary rounded"></div>
            </div>
        </div>
    );
}
