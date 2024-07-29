import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import { IFindAttribute } from "@/interface/api/attribute.interface";
import { IActionDedicateAttribute } from "@/interface/redux/attribute.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @ATTRIBUTE_LIST */
const listAttributeType = EReduxType.ATTRIBUTE_LIST;
export const listAttributeApi =
    (page: number, limit: number, key: string, orderBy: string) =>
    async (dispatch: TAppDispatch) => {
        const api = API_URLS.ATTRIBUTE.LIST(page, limit, key, orderBy);

        dispatch(isDispatchCalling(listAttributeType));

        const { response } = await apiCall<IFindAttribute>({ ...api });

        if (response) {
            const { items, ...pagination } = response.result;
            dispatch(
                isDispatchSuccess<IActionDedicateAttribute>(listAttributeType, {
                    ...pagination,
                    attrs: items,
                })
            );
        } else {
            dispatch(isDispatchFailed(listAttributeType));
        }
    };
