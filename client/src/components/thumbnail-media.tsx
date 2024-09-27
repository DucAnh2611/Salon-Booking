"use client";

import { IMediaThumbnail } from "@/interface/media.interface";
import { api_media_url } from "@/lib/apiCall";
import { getMediaType } from "@/lib/media-checker";
import { joinString } from "@/lib/string";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

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
                            {getMediaType(media.media.path) === "image" ? (
                                <Image
                                    alt="thumbnail"
                                    src={joinString({
                                        joinString: "",
                                        strings: [
                                            api_media_url,
                                            media.media.path,
                                        ],
                                    })}
                                    width={500}
                                    height={300}
                                    className={cn("w-full h-full object-cover")}
                                />
                            ) : (
                                <video
                                    src={joinString({
                                        joinString: "",
                                        strings: [
                                            api_media_url,
                                            media.media.path,
                                        ],
                                    })}
                                    className={cn("w-full h-full object-cover")}
                                />
                            )}
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
