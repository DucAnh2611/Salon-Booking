import {
    EOrderPaymentStatus,
    EOrderTransactionReturnPayos,
} from "@/enum/order.enum";

export interface ITransaction {}

export interface ITransactionOrder {
    id: string;
    paymentId: string;
    orderId: string;
    orderCode: string;
    orderAmount: number;
    paidAmount: number;

    accountBankBin: string;
    accountNumber: string;
    accountName: string;

    buyerAccountBankBin: any;
    buyerAccountNumber: any;
    buyerAccountName: any;

    description: string;

    paymentUrl: string;
    paymentTransactions: IPaymentTransactions[];

    expireAt: Date;
    createdAt: Date;

    createRefund: boolean;

    status: EOrderPaymentStatus;
}

export interface ITransactionTracking {
    transactions: ITransactionOrder[];
}

export interface IApiCancelTransaction {
    code: string;
    id: string;
    cancel: boolean;
    status: EOrderTransactionReturnPayos;
    orderCode: number;
}

export interface IApiSuccessTransaction {
    code: string;
    id: string;
    cancel: boolean;
    status: EOrderTransactionReturnPayos;
    orderCode: number;
}

export interface IPaymentTransactions {
    accountNumber: string;
    amount: number;
    counterAccountBankId: string | null;
    counterAccountBankName: string | null;
    counterAccountName: string | null;
    counterAccountNumber: string | null;
    description: string;
    reference: string;
    transactionDateTime: Date;
    virtualAccountName: string | null;
    virtualAccountNumber: string | null;
}
