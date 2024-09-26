import { TRootState } from "./store";

export const themeSelector = (state: TRootState) => state.themeReducer;

export const authSelector = (state: TRootState) => state.authReducer;

export const categorySelector = (state: TRootState) => state.categoryReducer;

export const mediaSelector = (state: TRootState) => state.mediaReducer;

export const permissionSelector = (state: TRootState) =>
    state.permissionReducer;

export const roleSelector = (state: TRootState) => state.roleReducer;

export const employeeSelector = (state: TRootState) => state.employeeReducer;

export const attributeSelector = (state: TRootState) => state.attributeReducer;

export const productSelector = (state: TRootState) => state.productReducer;

export const serviceSelector = (state: TRootState) => state.serviceReducer;

export const workingHourSelector = (state: TRootState) =>
    state.workingHourReducer;

export const shiftSelector = (state: TRootState) => state.shiftReducer;

export const orderSelector = (state: TRootState) => state.orderReducer;

export const orderDetailSelector = (state: TRootState) =>
    state.orderDetailReducer;

export const orderStateSelector = (state: TRootState) =>
    state.orderStateReducer;

export const orderRefundSelector = (state: TRootState) =>
    state.orderRefundReducer;
