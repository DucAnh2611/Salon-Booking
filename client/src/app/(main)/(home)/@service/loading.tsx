import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingServiceMain() {
    return (
        <div className="grid grid-cols-4 gap-12">
            <Skeleton className="w-full aspect-[9/12]" />
            <Skeleton className="w-full aspect-[9/12]" />
            <Skeleton className="w-full aspect-[9/12]" />
            <Skeleton className="w-full aspect-[9/12]" />
        </div>
    );
}
