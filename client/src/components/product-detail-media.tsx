"use client";

import { IProductMedia } from "@/interface/product.interface";
import { api_media_url } from "@/lib/apiCall";
import { getMediaType } from "@/lib/media-checker";
import { joinString } from "@/lib/string";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";

interface IProductDetailMediaProps {
    medias: IProductMedia[];
}

export default function ProductDetailMedia({
    medias,
}: IProductDetailMediaProps) {
    const [select, SetSelect] = useState<number>(0);

    const onSelect = (i: number) => () => {
        SetSelect(i === -1 ? medias.length - 1 : i % medias.length);
    };

    if (!medias.length) {
        return <div></div>;
    }

    return (
        <div className="w-full h-fit grid grid-cols-5 gap-4">
            <div className="flex flex-col gap-4 col-span-1 overflow-auto h-auto">
                {medias.map((media, i) => (
                    <div
                        key={
                            media.media
                                ? media.media.id
                                : Math.random() +
                                  Date.now() +
                                  "preview_product_detil"
                        }
                    >
                        {media.media ? (
                            <div
                                className={cn(
                                    "w-full overflow-hidden cursor-pointer opacity-100 duration-100 border-2 box-border bg-muted rounded-md",
                                    i === select
                                        ? "border-primary"
                                        : "opacity-40"
                                )}
                                onClick={onSelect(i)}
                            >
                                {getMediaType(media.media.path) === "image" ? (
                                    <Image
                                        alt="pre_p_detail"
                                        src={joinString({
                                            joinString: "",
                                            strings: [
                                                api_media_url,
                                                media.media.path,
                                            ],
                                        })}
                                        width={500}
                                        height={300}
                                        className="w-full h-full object-contain"
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
                                        controls={false}
                                        autoPlay
                                        className="w-full h-full object-contain"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="w-full aspect-square bg-muted flex items-center justify-center text-background">
                                <ImageOff size={15} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="col-span-4 aspect-square bg-muted rounded-md overflow-hidden">
                {medias[select].media && (
                    <div
                        className={cn(
                            "w-full h-full overflow-hidden cursor-pointer opacity-100 duration-100 box-border bg-muted relative rounded-md border"
                        )}
                    >
                        {medias.length > 1 && (
                            <>
                                <Button
                                    size="icon"
                                    className="rounded-full absolute top-1/2 left-5 -translate-y-1/2"
                                    variant="outline"
                                    onClick={onSelect(select - 1)}
                                >
                                    <ChevronLeft size={15} />
                                </Button>
                                <Button
                                    size="icon"
                                    className="rounded-full absolute top-1/2 right-5 -translate-y-1/2"
                                    variant="outline"
                                    onClick={onSelect(select + 1)}
                                >
                                    <ChevronRight size={15} />
                                </Button>
                            </>
                        )}
                        {getMediaType(medias[select].media.path) === "image" ? (
                            <Image
                                alt="pre_p_detail"
                                src={joinString({
                                    joinString: "",
                                    strings: [
                                        api_media_url,
                                        medias[select].media.path,
                                    ],
                                })}
                                width={1000}
                                height={1000}
                                className="w-full h-full object-contain"
                            />
                        ) : (
                            <video
                                src={joinString({
                                    joinString: "",
                                    strings: [
                                        api_media_url,
                                        medias[select].media.path,
                                    ],
                                })}
                                controls={false}
                                autoPlay
                                className="w-full h-full object-contain"
                            />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
