"use client";

export default function FeatureProductError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="w-full h-auto grid place-items-center">
            <p>Xảy ra lỗi</p>
        </div>
    );
}
