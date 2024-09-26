import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import {
    IApiOrderList,
    IOrderListResponse,
} from "@/interface/api/order.interface";
import { IActionDedicateOrder } from "@/interface/redux/order.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @ORDER_PRODUCT_LIST */
const listOrderProductType = EReduxType.ORDER_LIST;
export const listOrder =
    (body: IApiOrderList) => async (dispath: TAppDispatch) => {
        const api = API_URLS.ORDER.LIST();

        dispath(
            isDispatchCalling<IActionDedicateOrder>(listOrderProductType, {
                filter: body.filter,
                sort: body.order,
                page: body.page,
                limit: body.limit,
            })
        );

        const { response } = await apiCall<IOrderListResponse>({
            ...api,
            payload: body,
        });

        if (response) {
            const res = response.result;
            dispath(
                isDispatchSuccess<IActionDedicateOrder>(listOrderProductType, {
                    orders: res.items,
                    count: res.count,
                })
            );
        } else {
            dispath(
                isDispatchFailed<IActionDedicateOrder>(listOrderProductType, {
                    orders: [],
                })
            );
        }
    };
