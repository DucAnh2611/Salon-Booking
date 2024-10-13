import { IMedia } from "@/interface/media.interface";
import { api_media_url } from "@/lib/apiCall";
import { getMediaType } from "@/lib/media-checker";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { Fragment } from "react";

interface IMediaLoaderProps<T extends IMedia> {
    media: T | null;
}

export default function MediaLoader<T extends IMedia>({
    media,
}: IMediaLoaderProps<T>) {
    return (
        <Fragment>
            {media ? (
                getMediaType(media.path) === "image" ? (
                    <Image
                        src={api_media_url + media.path}
                        alt="emp"
                        className="w-full h-full object-cover"
                        width={500}
                        height={500}
                    />
                ) : (
                    <video
                        src={api_media_url + media.path}
                        muted
                        controls
                        className="w-full h-full object-cover"
                    />
                )
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageOff size={15} />
                </div>
            )}
        </Fragment>
    );
}
