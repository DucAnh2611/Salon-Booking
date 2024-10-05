import { API_URLS } from "@/constants/api.constant";
import { EReduxType } from "@/enum/type-redux.enum";
import {
    isDispatchCalling,
    isDispatchFailed,
    isDispatchSuccess,
} from "@/helpers/dispatchDedicate";
import { IListJob, IListJobReponse } from "@/interface/api/job.interface";
import { IActionDedicateJob } from "@/interface/redux/job.interface";
import { apiCall } from "@/utils/apiCall";
import { TAppDispatch } from "../store";

/** @MY_JOB */
const myJobType = EReduxType.MY_JOB;
export const myJob = (body: IListJob) => async (dispatch: TAppDispatch) => {
    const api = API_URLS.JOB.MY_JOB();

    dispatch(isDispatchCalling(myJobType));

    const { response } = await apiCall<IListJobReponse>({
        ...api,
        payload: body,
    });

    if (response) {
        const { items: jobs, page, limit, count } = response.result;
        dispatch(
            isDispatchSuccess<IActionDedicateJob>(myJobType, {
                jobs,
                limit,
                page,
                count,
                ...(body.from && { from: body.from }),
                ...(body.to && { to: body.to }),
            })
        );
    } else {
        dispatch(isDispatchFailed(myJobType));
    }
};
