import { API_URLS } from "@/constant/api.constant";
import { IOrganization } from "@/interface/organization.interface";
import { apiCall } from "../apiCall";

/** @CURRENT_ORGANIZATION */
export const currentOrganization = async () => {
    const api = API_URLS.ORGANIZATION.CURRENT();

    const resAPi = await apiCall<IOrganization | null>({ ...api });

    return resAPi;
};
