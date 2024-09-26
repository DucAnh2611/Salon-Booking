import { API_URLS } from "@/constant/api.constant";
import { IEmployeeShift } from "@/interface/employee.interface";
import {
    IApiCheckOverlapServiceEmployee,
    IApiShiftBookingTime,
    IApiShiftEmployeeBooking,
} from "@/interface/shift.interface";
import { IWorkingHourBooking } from "@/interface/working-hour.interface";
import { apiCall } from "../apiCall";

/** @GET_SHIFT_BOOKING_TIME */
export const getShiftBookingTime = async (body: IApiShiftBookingTime) => {
    const api = API_URLS.SHIFT.GET_BOOKING_TIME();

    const resApi = await apiCall<IWorkingHourBooking>({
        ...api,
        payload: body,
    });

    return resApi;
};

/** @GET_SHIFT_EMPLOYEE_BOOKING */
export const getShiftEmployeeBooking = async (
    body: IApiShiftEmployeeBooking
) => {
    const api = API_URLS.SHIFT.GET_EMPLOYEE_BOOKING();

    const resApi = await apiCall<IEmployeeShift[]>({
        ...api,
        payload: body,
    });

    return resApi;
};

/** @CHECK_OVERLAP_SERVICE_EMPLOYEE */
export const checkOverlapServiceEmployee = async (
    body: IApiCheckOverlapServiceEmployee
) => {
    const api = API_URLS.SHIFT.CHECK_OVERLAP_SERVICE_EMPLOYEE();

    const resApi = await apiCall({
        ...api,
        payload: body,
    });

    return resApi;
};
