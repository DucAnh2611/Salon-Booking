import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import { ISetting, ISettingUpdate } from "@/interface/api/setting.interface";
import { IActionDedicateSetting } from "@/interface/redux/setting.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @SETTING_GET */
const settingGetType = EReduxType.SETTING_GET;
export const settingGet = () => async (dispatch: TAppDispatch) => {
    const api = API_URLS.SETTING.GET();

    dispatch(isDispatchCalling(settingGetType));

    const { response } = await apiCall<ISetting>({ ...api });

    if (response) {
        dispatch(
            isDispatchSuccess<IActionDedicateSetting>(settingGetType, {
                setting: response.result,
            })
        );
    } else {
        dispatch(isDispatchFailed(settingGetType));
    }
};

/** @SETTING_UPDATE */
const settingUpdateType = EReduxType.SETTING_UPDATE;
export const settingUpdate =
    (body: ISettingUpdate) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.SETTING.UPDATE();

        dispatch(isDispatchCalling(settingUpdateType));

        const { response } = await apiCall({ ...api, payload: body });

        if (response) {
            dispatch(isDispatchSuccess(settingUpdateType));
        } else {
            dispatch(isDispatchFailed(settingUpdateType));
        }
    };

/** @SETTTING_RESET */
const settingResetType = EReduxType.SETTING_RESET;
export const settingReset = () => async (dispatch: TAppDispatch) => {
    const api = API_URLS.SETTING.RESET();

    dispatch(isDispatchCalling(settingResetType));

    const { response } = await apiCall({ ...api });

    if (response) {
        dispatch(isDispatchSuccess(settingResetType));
    } else {
        dispatch(isDispatchFailed(settingResetType));
    }
};
