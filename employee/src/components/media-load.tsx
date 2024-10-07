import { IMedia } from "@/interface/api/media.interface";
import { api_media_url } from "@/utils/apiCall";
import { getMediaType } from "@/utils/media-checker.util";
import { ImageOff } from "lucide-react";

interface IMediaLoaderProps<T extends IMedia> {
    media: T | null;
}

export default function MediaLoader<T extends IMedia>({
    media,
}: IMediaLoaderProps<T>) {
    return (
        <>
            {media ? (
                getMediaType(media.path) === "image" ? (
                    <img
                        src={api_media_url + media.path}
                        alt="emp"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <video
                        src={api_media_url + media.path}
                        className="w-full h-full object-cover"
                    />
                )
            ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                    <ImageOff size={15} />
                </div>
            )}
        </>
    );
}
