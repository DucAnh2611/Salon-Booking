import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import { IListAllPermission } from "@/interface/api/permission.interface";
import { IActionDedicatePermission } from "@/interface/redux/permission.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @PERMISSION_LIST */
const listPermissionType = EReduxType.PERMISSION_LIST;
export const listPermissionApi = () => async (dispatch: TAppDispatch) => {
    const api = API_URLS.PERMISSION.LIST();

    dispatch(isDispatchCalling(listPermissionType));

    const { response } = await apiCall<IListAllPermission>({ ...api });

    if (response) {
        dispatch(
            isDispatchSuccess<IActionDedicatePermission>(listPermissionType, {
                permissions: response.result.items,
            })
        );
    } else {
        dispatch(isDispatchFailed(listPermissionType));
    }
};
