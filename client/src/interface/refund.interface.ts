import { EOrderRefundRequestStatus } from "@/enum/order.enum";
import { IBank } from "./bank.interface";
import { IRefundState } from "./refund-state";
import { ITransactionOrder } from "./transaction.interface";
import { IUserBase } from "./user.interface";

export interface IRefund {}

export interface IRefundOrder {
    id: string;
    orderId: string;
    transactionId: string;
    amount: number;
    status: EOrderRefundRequestStatus;
    expiredAt: Date;
    createdBy: string;
    updatedBy: string;
    accountBankBin: string;
    accountBankNumber: string;
    accountBankName: string;
    createdAt: Date;
    updatedAt: Date;
    userCreate: IUserBase;
    userUpdate: IUserBase;
    transaction: ITransactionOrder | null;
    orderRefundStates: IRefundState[];
    description: string;
    bank: IBank;
}

export interface IRefundTracking {
    refunds: IRefundOrder[];
}

export interface IRefundCreate {
    orderId: string;
    transactionId?: string;
    amount: number;
    accountName: string;
    accountNumber: string;
    accountBankBin: string;
    note: string;
}
