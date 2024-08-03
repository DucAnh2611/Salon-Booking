import { LoaderCircleIcon } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="flex gap-3 items-center">
                <LoaderCircleIcon size={30} className="animate-spin" /> Đang tải
            </div>
        </div>
    );
}
