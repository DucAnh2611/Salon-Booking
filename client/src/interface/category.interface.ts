import { IMedia } from "./media.interface";

export interface ICategory {
    id: string;
    title: string;
    imageId: string;
    image: IMedia | null;
    parentId: string;
}

export interface ICategoryTree extends ICategory {
    haveChildren: boolean;
}
