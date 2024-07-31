import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IFindService,
    IServiceCreate,
    IServiceDetail,
    IServiceUpdate,
} from "@/interface/api/service.interface";
import { IActionDedicateService } from "@/interface/redux/service.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @SERVICE_CREATE */
const createServiceType = EReduxType.SERVICE_CREATE;
export const createServiceApi =
    (payload: IServiceCreate) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.SERVICE.CREATE();

        dispatch(isDispatchCalling(createServiceType));

        const { response } = await apiCall({ ...api, payload });

        if (response) {
            dispatch(isDispatchSuccess(createServiceType));
        } else {
            dispatch(isDispatchFailed(createServiceType));
        }
    };

/** @SERVICE_LIST_PARAM */
const listServiceParamType = EReduxType.SERVICE_LIST_PARAM;
export const listServiceParamApi =
    (page: number, limit: number, key: string, orderBy: string) =>
    async (dispatch: TAppDispatch) => {
        dispatch(
            isDispatchSuccess<IActionDedicateService>(listServiceParamType, {
                page,
                limit,
                key,
                orderBy,
            })
        );
    };

/** @SERVICE_LIST */
const listServiceType = EReduxType.SERVICE_LIST;
export const listServiceApi =
    (page: number, limit: number, key: string, orderBy: string) =>
    async (dispatch: TAppDispatch) => {
        const api = API_URLS.SERVICE.LIST(page, limit, key, orderBy);

        dispatch(isDispatchCalling(listServiceType));

        const { response } = await apiCall<IFindService>({ ...api });

        if (response) {
            const { items, ...pagination } = response.result;
            dispatch(
                isDispatchSuccess<IActionDedicateService>(listServiceType, {
                    ...pagination,
                    services: items,
                })
            );
        } else {
            dispatch(isDispatchFailed(listServiceType));
        }
    };

/** @SERVICE_DETAIL */
const detailServiceType = EReduxType.SERVICE_DETAIL;
export const detailServiceApi =
    (id: string) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.SERVICE.DETAIL(id);

        dispatch(isDispatchCalling(detailServiceType));

        const { response } = await apiCall<IServiceDetail>({ ...api });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateService>(detailServiceType, {
                    detail: response.result,
                })
            );
        } else {
            dispatch(isDispatchFailed(detailServiceType));
        }
    };

/** @SERVICE_DELETE_LIST */
const listDeleleType = EReduxType.SERVICE_DELETE_LIST;
export const listDeteteApi =
    (ids: string[]) => async (dispatch: TAppDispatch) => {
        dispatch(
            isDispatchSuccess<IActionDedicateService>(listDeleleType, {
                deleteItems: ids,
            })
        );
    };

/** @SERVICE_DELETE */
const deleteServiceType = EReduxType.SERVICE_DELETE;
export const deleteServiceApi =
    (ids: string[]) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.SERVICE.DELETE();

        dispatch(isDispatchCalling(deleteServiceType));

        const { response } = await apiCall({ ...api, payload: { ids } });

        if (response) {
            dispatch(isDispatchSuccess(deleteServiceType));
        } else {
            dispatch(isDispatchFailed(deleteServiceType));
        }
    };

/** @SERVICE_UPDATE */
const updateServiceType = EReduxType.SERVICE_UPDATE;
export const updateServiceApi =
    (payload: IServiceUpdate) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.SERVICE.UPDATE();

        dispatch(isDispatchCalling(updateServiceType));

        const { response } = await apiCall({ ...api, payload });

        if (response) {
            dispatch(isDispatchSuccess(updateServiceType));
        } else {
            dispatch(isDispatchFailed(updateServiceType));
        }
    };
