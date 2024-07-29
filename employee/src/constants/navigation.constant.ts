import { IItemNavigate } from "@/components/item-pane";
import {
    ArchiveIcon,
    CalendarClockIcon,
    ImagePlayIcon,
    ListFilterIcon,
    ReceiptIcon,
    ShieldCheckIcon,
    ShowerHeadIcon,
    UserRoundPenIcon,
} from "lucide-react";
import { ROUTER_PATH } from "./router.constant";

export const listNavigate: IItemNavigate[] = [
    {
        Icon: ListFilterIcon,
        title: "Danh mục sản phẩm",
        path: `${ROUTER_PATH.CATEGORY}`,
    },
    {
        Icon: ImagePlayIcon,
        title: "Quản lý file",
        path: `${ROUTER_PATH.MEDIA}`,
    },
    {
        Icon: ShowerHeadIcon,
        title: "Dịch vụ",
        children: [
            {
                title: "Danh sách dịch vụ",
                path: `${ROUTER_PATH.SERVICE}`,
            },
            {
                title: "Thêm dịch vụ",
                path: `${ROUTER_PATH.SERVICE}/add`,
            },
        ],
    },
    {
        Icon: ArchiveIcon,
        title: "Sản phẩm",
        children: [
            { title: "Danh sách sản phẩm", path: `${ROUTER_PATH.PRODUCT}` },
            {
                title: "Thêm sản phẩm",
                path: `${ROUTER_PATH.PRODUCT}/add`,
            },
        ],
    },
    {
        Icon: UserRoundPenIcon,
        title: "Quản lý nhân viên",
        children: [
            {
                title: "Danh sách nhân viên",
                path: `${ROUTER_PATH.EMPLOYEE}`,
            },
            {
                title: "Thêm nhân viên",
                path: `${ROUTER_PATH.EMPLOYEE}/add`,
            },
        ],
    },
    {
        Icon: ShieldCheckIcon,
        title: "Chức vụ và quyền hạn",
        children: [
            {
                title: "Danh sách chức vụ và quyền hạn",
                path: `${ROUTER_PATH.ROLE}`,
            },
            {
                title: "Thêm chức vụ",
                path: `${ROUTER_PATH.ROLE}/add`,
            },
        ],
    },
    {
        Icon: CalendarClockIcon,
        title: "Thời gian làm việc",
        children: [
            {
                title: "Ngày làm việc",
                path: `${ROUTER_PATH.WORKING}`,
            },
            {
                title: "Ca làm việc",
                path: `${ROUTER_PATH.SHIFT}`,
            },
        ],
    },
    {
        Icon: ReceiptIcon,
        title: "Đơn hàng",
        children: [
            {
                title: "Sản phẩm",
                path: `${ROUTER_PATH.ORDER_PRODUCT}`,
            },
            {
                title: "Dịch vụ",
                path: `${ROUTER_PATH.ORDER_SERVICE}`,
            },
        ],
    },
];
