import { LoaderCircle } from "lucide-react";

export default function Loading() {
    return (
        <div className="w-full h-full absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center ">
            <div className="w-full h-full absolute top-0 left-0 bg-muted opacity-30 z-[0]" />
            <div className="w-fit text-sm flex gap-1 items-center relative z-[1]">
                <span>
                    <LoaderCircle size={15} className="animate-spin" />
                </span>
                <span>Đang tải</span>
            </div>
        </div>
    );
}
