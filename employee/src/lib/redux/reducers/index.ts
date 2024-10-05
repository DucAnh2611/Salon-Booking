import { combineReducers } from "redux";
import { attributeReducer } from "./attribute.reducer";
import authReducer from "./auth.reducer";
import { categoryReducer } from "./category.reducer";
import { clientReducer } from "./client.reducer";
import { dashboardReducer } from "./dashboard.reducer";
import { employeeReducer } from "./employee.reducer";
import { jobReducer } from "./job.reducer";
import { mediaReducer } from "./media.reducer";
import { orderDetailReducer } from "./order-detail.reducer";
import { orderRefundReducer } from "./order-refund.reducer";
import { orderStateReducer } from "./order-state.reducer";
import { orderReducer } from "./order.reducer";
import { organizationReducer } from "./organization.reducer";
import { permissionReducer } from "./permission.reducer";
import { productReducer } from "./product.reducer";
import { roleReducer } from "./role.reducer";
import { serviceReducer } from "./service.reducer";
import { shiftReducer } from "./shift.reducer";
import { themeReducer } from "./theme.reducer";
import { workingHourReducer } from "./working-hour.reducer";

const rootReducer = combineReducers({
    themeReducer,
    authReducer,
    categoryReducer,
    mediaReducer,
    roleReducer,
    permissionReducer,
    employeeReducer,
    attributeReducer,
    productReducer,
    serviceReducer,
    workingHourReducer,
    shiftReducer,
    orderReducer,
    orderDetailReducer,
    orderStateReducer,
    orderRefundReducer,
    clientReducer,
    dashboardReducer,
    organizationReducer,
    jobReducer,
});

export default rootReducer;
