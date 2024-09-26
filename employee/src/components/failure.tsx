import { Ban } from "lucide-react";

export default function Failure({ type = "Bản ghi" }: { type?: string }) {
    return (
        <div className="w-full h-full absolute top-0 left-0 backdrop-blur-sm flex justify-center items-center ">
            <div className="w-full h-full absolute top-0 left-0 bg-destructive opacity-20 z-[0]" />
            <div className="w-fit text-sm flex gap-1 items-center relative z-[1] text-destructive font-medium">
                <span>
                    <Ban size={15} />
                </span>
                <span>Lỗi</span>
            </div>
        </div>
    );
}
