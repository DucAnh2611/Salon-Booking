import { combineReducers } from "redux";
import { attributeReducer } from "./attribute.reducer";
import authReducer from "./auth.reducer";
import { categoryReducer } from "./category.reducer";
import { employeeReducer } from "./employee.reducer";
import { mediaReducer } from "./media.reducer";
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
});

export default rootReducer;
