import { API_URLS } from "@/constants/api.constant";
import { EFileType } from "@/enum/media.enum";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IFindMediaAdmin,
    IMediaUpdateBody,
} from "@/interface/api/media.interface";
import {
    IActionDedicateMedia,
    IActionDedicateMediaParam,
} from "@/interface/redux/media.interface";
import { apiCall } from "@/utils/apiCall";
import { DeepPartial } from "react-hook-form";
import { TAppDispatch } from "../store";

/** @MEDIA_LIST */
const listMediaType = EReduxType.MEDIA_LIST;
export const listMediaApi =
    (
        page: number,
        limit: number,
        key: string,
        typeMedia: EFileType | null,
        orderBy: string
    ) =>
    async (dispatch: TAppDispatch) => {
        const api = API_URLS.MEDIA.LIST(page, limit, key, orderBy, typeMedia);
        dispatch(
            isDispatchCalling<IActionDedicateMedia>(listMediaType, {
                page,
                limit,
                key,
                orderBy,
                typeMedia,
            })
        );

        const { response } = await apiCall<IFindMediaAdmin>({ ...api });

        if (response) {
            const { items, ...props } = response.result;
            dispatch(
                isDispatchSuccess<IActionDedicateMedia>(listMediaType, {
                    ...props,
                    medias: items,
                })
            );
        } else dispatch(isDispatchFailed<IActionDedicateMedia>(listMediaType));
    };

/** @MEDIA_LIST_PARAM */
const mediaParamType = EReduxType.MEDIA_LIST_PARAM;
export const setMediaParam =
    (param: DeepPartial<IActionDedicateMediaParam>) =>
    async (dispatch: TAppDispatch) => {
        dispatch(
            isDispatchSuccess<IActionDedicateMedia>(mediaParamType, param)
        );
    };

/** @MEDIA_UPDATE */
const mediaUpdateType = EReduxType.MEDIA_UPDATE;
export const updateMediaApi =
    (id: string, payload: IMediaUpdateBody) =>
    async (dispatch: TAppDispatch) => {
        const api = API_URLS.MEDIA.UPDATE(id);

        dispatch(isDispatchCalling<IActionDedicateMedia>(mediaUpdateType));

        const { response } = await apiCall({ ...api, payload });

        if (response) {
            dispatch(isDispatchSuccess<IActionDedicateMedia>(mediaUpdateType));
        } else {
            dispatch(isDispatchFailed<IActionDedicateMedia>(mediaUpdateType));
        }
    };

/** @MEDIA_CREATE */
const mediaCreateType = EReduxType.MEDIA_CREATE;
export const uploadMediaApi =
    (formData: FormData) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.MEDIA.UPLOADS();

        dispatch(isDispatchCalling(mediaCreateType));

        const { response } = await apiCall({ ...api, payload: formData });

        if (response) {
            dispatch(isDispatchSuccess(mediaCreateType));
        } else dispatch(isDispatchFailed(mediaCreateType));
    };

/** @MEDIA_DELETE_LIST */
const setDeleteMediaType = EReduxType.MEDIA_DELETE_LIST;
export const setDeleteMediaApi =
    (deleteItems: string[]) => async (dispatch: TAppDispatch) => {
        dispatch(
            isDispatchSuccess<IActionDedicateMedia>(setDeleteMediaType, {
                deleteItems,
            })
        );
    };

/** @MEDIA_DELETE */
const mediaDeleteType = EReduxType.MEDIA_DELETE;
export const deleteMediaApi =
    (deleteItems: string[]) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.MEDIA.DELETE();

        dispatch(isDispatchCalling<IActionDedicateMedia>(mediaDeleteType));

        const { response } = await apiCall({
            ...api,
            payload: { ids: deleteItems },
        });

        if (response) {
            dispatch(isDispatchSuccess<IActionDedicateMedia>(mediaDeleteType));
        } else
            dispatch(isDispatchFailed<IActionDedicateMedia>(mediaDeleteType));
    };
