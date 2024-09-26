import { EOrderPaymentStatus } from "@/enum/order.enum";

export interface ITransaction {
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

    status: EOrderPaymentStatus;
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
