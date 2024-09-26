import { EOrderRefundRequestStatus } from "@/enum/order.enum";
import { IBank } from "./bank.interface";
import { IUser } from "./employee.interface";
import { IRefundState } from "./refund-state.interface";
import { ITransaction } from "./transaction.interface";

export interface IRefund {
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
    userCreate: IUser;
    userUpdate: IUser;
    transaction: ITransaction | null;
    orderRefundStates: IRefundState[];
    description: string;
    bank: IBank;
}

export interface IApiApproveRefund {
    mediaUrl: string;
    requestId: string;
    note?: string;
    bankTransactionCode: string;
}

export interface IApiDeclineRefund {
    requestId: string;
    note: string;
}
