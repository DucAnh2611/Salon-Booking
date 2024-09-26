import { IEmployeeShift } from "./employee.interface";
import { IShift } from "./shift.interface";

export interface IService {
    id: string;
    name: string;
    price: number;

    deletedAt: Date;
    duration: number;
}

export interface IServiceDetail extends IService {}

export interface IServiceItemCart extends IService {
    id: string;
    cartServiceId: string;

    service: IService;
    serviceId: string;

    duration: number;

    createdAt: Date;
}

export interface IServiceItemCartBooking extends IServiceItemCart {
    employee: IEmployeeShift | null;
    shift: IShift | null;
    bookingTime: Date | null;
}
