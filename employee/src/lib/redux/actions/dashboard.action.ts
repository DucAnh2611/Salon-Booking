import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import { IStatisticDashboard } from "@/interface/api/dashboard.interface";
import { IActionDedicateStatisticDashboard } from "@/interface/redux/dashboard.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @STATISTIC_DASHBOARD */
const statisticDasboardType = EReduxType.STATISTIC_DASHBOARD;
export const statisticDashboard =
    (year: number, month?: number) => async (dispatch: TAppDispatch) => {
        const api = API_URLS.STATISTIC.DASHBOARD();

        dispatch(isDispatchCalling(statisticDasboardType));

        const { response } = await apiCall<IStatisticDashboard>({
            ...api,
            payload: { year, ...(month && { month }) },
        });

        if (response) {
            dispatch(
                isDispatchSuccess<IActionDedicateStatisticDashboard>(
                    statisticDasboardType,
                    {
                        year,
                        month,
                        statistic: response.result,
                    }
                )
            );
        } else {
            dispatch(isDispatchFailed(statisticDasboardType));
        }
    };
