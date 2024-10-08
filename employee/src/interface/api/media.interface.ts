import { EFileType } from "@/enum/media.enum";
import { IUserEmployee } from "./employee.interface";

export interface IMedia {
    id: string;
    path: string;
    title: string;
    type: EFileType;
}

export interface IMediaAdmin extends IMedia {
    userCreate: IUserEmployee;
    userUpdate: IUserEmployee;
}

export interface IFindMediaAdmin {
    count: number;
    limit: number;
    page: number;
    items: IMediaAdmin[];
}

export interface IMediaUpdateBody {
    title: string;
}

export interface IMediaTempUpload {
    url: string;
    sessionId: string;
    context: string;
}

export interface IMediaProductTempBase {
    id: string;
    isThumbnail: boolean;
}

export interface IMediaServiceTempBase {
    id: string;
    isThumbnail: boolean;
}
export interface IMediaServiceUpdateTempUrl {
    id?: string;
    isThumbnail: boolean;
    url: string;
    tempId?: string;
}

export interface IMediaServiceTempUrl extends IMediaServiceTempBase {
    url: string;
}
export interface IMediaProductTempUrl extends IMediaProductTempBase {
    url: string;
}
export interface IMediaProductTempId extends IMediaProductTempBase {
    media: IMedia;
}

export interface IMediaProductTempUrlCreate {
    url: string;
    isThumbnail: boolean;
}

export interface IMediaThumbnail {
    media: IMedia | null;
    mediaId: string | null;
    isThumbnail: boolean;
}
