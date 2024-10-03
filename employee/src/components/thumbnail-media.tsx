import { IMediaThumbnail } from "@/interface/api/media.interface";
import { cn } from "@/lib";
import { ImageOff } from "lucide-react";
import { useEffect, useState } from "react";
import MediaLoader from "./media-load";

interface IThumbnailMediaProps {
    medias: IMediaThumbnail[];
}

export default function ThumbnailMedia({ medias }: IThumbnailMediaProps) {
    const [currentIndex, SetCurrentIndex] = useState<number>(0);

    const items = medias.filter((m) => m.isThumbnail);

    useEffect(() => {
        if (items.length > 1) {
            const interval = setInterval(() => {
                SetCurrentIndex((c) => (c + 1) % items.length);
            }, 2000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [items]);

    return (
        <div className="w-full h-full relative">
            {items.length &&
                items.map((media, i) =>
                    media.media ? (
                        <div
                            key={media.mediaId + "thumb"}
                            className={cn(
                                "w-full h-full absolute top-0 left-0 duration-100",
                                currentIndex === i ? "visible" : "invisible"
                            )}
                        >
                            <MediaLoader media={media.media} />
                        </div>
                    ) : (
                        <div
                            key={"thumb" + Date.now()}
                            className="w-full h-full flex items-center justify-center"
                        >
                            <p className="text-sm ">Tệp đã bị xóa</p>
                        </div>
                    )
                )}
            {items.length && (
                <div className="w-full h-full flex items-center justify-center text-white">
                    <ImageOff size={20} />
                </div>
            )}
        </div>
    );
}
