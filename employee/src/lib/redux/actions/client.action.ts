import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IApiClientList,
    IApiUpdateLockClient,
    IClientResponse,
} from "@/interface/api/client.interface";
import { IActionDedicateClient } from "@/interface/redux/client.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @LIST_CLIENT */
const clientListType = EReduxType.LIST_CLIENT;
export const clientList =
    (body: IApiClientList) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.CLIENT.LIST();

        dispatch(isDispatchCalling(clientListType));

        const { response } = await apiCall<IClientResponse>({
            ...api,
            payload: body,
        });

        if (response) {
            const { items, page, count, limit } = response.result;
            dispatch(
                isDispatchSuccess<IActionDedicateClient>(clientListType, {
                    clients: items,
                    page,
                    count,
                    limit,
                })
            );
        }

        dispatch(isDispatchFailed<IActionDedicateClient>(clientListType));
    };

/** @UPDATE_CLIENT_LOCK */
const updateLockClientType = EReduxType.UPDATE_CLIENT_LOCK;
export const updateLockClient =
    (body: IApiUpdateLockClient) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.CLIENT.UPDATE_LOCK();

        dispatch(isDispatchCalling(updateLockClientType));

        const { response } = await apiCall<IClientResponse>({
            ...api,
            payload: body,
        });

        if (response) {
            dispatch(isDispatchSuccess(updateLockClientType));
        }

        dispatch(isDispatchFailed<IActionDedicateClient>(updateLockClientType));
    };

/** @RELOAD_CLIENT */
const reloadClientType = EReduxType.RELOAD_CLIENT;
export const reloadClient = () => async (dispatch: TAppDispatch) => {
    dispatch(isDispatchSuccess(reloadClientType));
};
