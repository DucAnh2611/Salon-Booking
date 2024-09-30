import { EOrderStatus } from "@/enum/order.enum";
import { IEmployeeServiceSnapshot } from "./employee.interface";
import { IProductSnapshot, IProductTypeSnapshot } from "./product.interface";
import { IServiceSnapshot } from "./service.interface";

export interface IStatisticDashboard {
    start: string;
    end: string;
    totalIncome: number;
    totalOrders: number;
    totalProducts: number;
    totalServices: number;
    order: IOrderStatistic;
    service: IServiceStatistic;
    product: IProductStatistic;
    income: IIncomeStatistic;
}

export interface IOrderStatistic {
    orderCountDetail: IOrderCountDetailStatistic[];
    orderCount: number;
}

export interface IServiceStatistic {
    mostEmployeeBooked: IMostEmployeeBooked[];
    mostServiceBooked: IMostServiceBooked[];
}

export interface IProductStatistic {
    mostProductSold: IMostProductSold[];
}

export interface IIncomeStatistic {
    groupBy: "year" | "month";
    data: IInComeData[];
}

export interface IOrderCountDetailStatistic {
    status: EOrderStatus;
    count: string;
}

export interface IMostProductSold {
    id: string;
    productId: string;
    productTypeId: string | null;
    // using jsonb merge snapsshot => snapshot[1]
    productSnapshot: IProductSnapshot[];
    productTypeSnapshot: IProductTypeSnapshot[] | null;
    count: string;
}

export interface IMostServiceBooked {
    serviceId: string;
    // using jsonb merge snapsshot => snapshot[1]
    serviceSnapshot: IServiceSnapshot[];
    count: number;
}

export interface IMostEmployeeBooked {
    employeeId: string;
    // using jsonb merge snapsshot => snapshot[1]
    employeeSnapShot: IEmployeeServiceSnapshot[];
    count: number;
}

export interface IInComeData {
    day?: number;
    month?: number;
    service: number;
    product: number;
}
