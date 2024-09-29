import { ILoginPayload } from "../api/auth.interface";
import { IEmployee } from "../api/employee.interface";
import { IBaseInitialState } from "./base.interface";

export interface IInitialStateAuth extends IBaseInitialState {
    authentication: boolean;
    loginPayload: ILoginPayload | null | undefined;
    user: IEmployee | null | undefined;
    retry: boolean;
}

export interface IActionDedicateAuth {
    loginPayload?: ILoginPayload | null;
    user?: IEmployee | null;
}
