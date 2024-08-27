import { EFileType } from "@/enum/media.enum";

export interface IMedia {
    id: string;
    path: string;
    title: string;
    type: EFileType;
}
