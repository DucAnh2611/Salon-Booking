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
    Users,
} from "lucide-react";
import { ROUTER_PATH } from "./router.constant";

export const listNavigate: IItemNavigate[] = [
    {
        Icon: ListFilterIcon,
        title: "Danh mục",
        path: `${ROUTER_PATH.CATEGORY}`,
    },
    {
        Icon: ImagePlayIcon,
        title: "Quản lý tệp phương tiện",
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
        Icon: Users,
        title: "Quản lý khách hàng",
        children: [
            {
                title: "Danh sách khách hàng",
                path: `${ROUTER_PATH.CLIENT}`,
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
        title: "Ngày làm việc",
        path: `${ROUTER_PATH.WORKING}`,
    },
    {
        Icon: ReceiptIcon,
        title: "Đơn hàng",
        children: [
            {
                title: "Danh sách đơn hàng",
                path: `${ROUTER_PATH.ORDER}`,
            },
        ],
    },
];
