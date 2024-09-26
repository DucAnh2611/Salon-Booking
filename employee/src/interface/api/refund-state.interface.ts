import { EOrderRefundStatus } from "@/enum/order.enum";
import { IUser } from "./employee.interface";
import { IMedia } from "./media.interface";

export interface IRefundState {
    id: string;
    refundRequestId: string;
    createdBy: string;
    status: EOrderRefundStatus;
    mediaId: string | null;
    bankTransactionCode: string;
    note?: string;
    createdAt: Date;
    media: IMedia | null;
    userCreate: IUser;
}
