import { EFileType } from "@/enum/media.enum";
import { IMediaAdmin } from "../api/media.interface";
import { ICRUDInitialState } from "./base.interface";

export interface IInitialStateMedia extends ICRUDInitialState {
    page: number;
    limit: number;
    count: number;
    key: string;
    typeMedia: EFileType | null;
    orderBy: string;
    medias: IMediaAdmin[];
    deleteItems: string[];
}

export interface IActionDedicateMedia {
    page?: number;
    limit?: number;
    count?: number;
    key?: string;
    typeMedia?: EFileType | null;
    orderBy?: string;
    medias?: IMediaAdmin[];
    deleteItems?: string[];
}

export interface IActionDedicateMediaParam {
    page: number;
    limit: number;
    key: string;
    typeMedia: EFileType | null;
    orderBy: string;
}
