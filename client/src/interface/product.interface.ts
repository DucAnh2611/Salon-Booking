import { IMedia } from "./media.interface";

export interface IProduct {
    id: string;
    price: number;
    quantity: number;
    name: number;
    description: number;
    productMedia: IProductMedia[];
}

export interface IProductTypes {}

export interface IProductMedia {
    productId: string;
    mediaId: string;
    isThumbnail: boolean;
    media: IMedia;
}
