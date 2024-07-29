import { combineReducers } from "redux";
import { attributeReducer } from "./attribute.reducer";
import authReducer from "./auth.reducer";
import { categoryReducer } from "./category.reducer";
import { employeeReducer } from "./employee.reducer";
import { mediaReducer } from "./media.reducer";
import { permissionReducer } from "./permission.reducer";
import { productReducer } from "./product.reducer";
import { roleReducer } from "./role.reducer";
import { themeReducer } from "./theme.reducer";

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
});

export default rootReducer;
