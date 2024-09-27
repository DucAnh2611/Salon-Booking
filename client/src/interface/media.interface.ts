import { EFileType } from "@/enum/media.enum";

export interface IMedia {
    id: string;
    path: string;
    title: string;
    type: EFileType;
}

export interface IMediaThumbnail {
    media: IMedia | null;
    mediaId: string | null;
    isThumbnail: boolean;
}
