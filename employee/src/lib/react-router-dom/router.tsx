import { ROUTER_PATH } from "@/constants/router.constant";
import AdminLayout from "@/layouts/admin.layout";
import CategoryScreen from "@/screens/category";
import EmployeeScreen from "@/screens/employee";
import CreateEmployeeScreen from "@/screens/employee/create";
import UpdateEmployeeScreen from "@/screens/employee/update";
import ErrorScreen from "@/screens/error";
import { HomeScreen } from "@/screens/home";
import LoginScreen from "@/screens/login";
import { default as MediaScreen } from "@/screens/media";
import NotFound from "@/screens/notFound";
import ProductScreen from "@/screens/product";
import CreateProductScreen from "@/screens/product/create";
import UpdateProductScreen from "@/screens/product/update";
import RoleScreen from "@/screens/role";
import CreateRoleScreen from "@/screens/role/create";
import UpdateRoleScreen from "@/screens/role/update";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
    {
        element: <AdminLayout />,
        errorElement: <ErrorScreen />,
        children: [
            {
                path: ROUTER_PATH.HOME,
                element: <HomeScreen />,
            },
            {
                path: ROUTER_PATH.CATEGORY,
                element: <CategoryScreen />,
            },
            {
                path: ROUTER_PATH.MEDIA,
                element: <MediaScreen />,
            },
            {
                path: ROUTER_PATH.ROLE,
                children: [
                    {
                        path: "",
                        element: <RoleScreen />,
                    },
                    {
                        path: "add",
                        element: <CreateRoleScreen />,
                    },
                    {
                        path: ":id",
                        element: <UpdateRoleScreen />,
                    },
                ],
            },
            {
                path: ROUTER_PATH.EMPLOYEE,
                children: [
                    {
                        path: "",
                        element: <EmployeeScreen />,
                    },
                    {
                        path: "add",
                        element: <CreateEmployeeScreen />,
                    },
                    {
                        path: ":id",
                        element: <UpdateEmployeeScreen />,
                    },
                ],
            },
            {
                path: ROUTER_PATH.PRODUCT,
                children: [
                    {
                        path: "",
                        element: <ProductScreen />,
                    },
                    {
                        path: ":id",
                        element: <UpdateProductScreen />,
                    },
                    {
                        path: "add",
                        element: <CreateProductScreen />,
                    },
                ],
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
    {
        path: ROUTER_PATH.LOGIN,
        element: <LoginScreen />,
    },
]);
