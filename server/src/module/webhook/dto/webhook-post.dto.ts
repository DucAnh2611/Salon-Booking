export class WebhookRefundResultDto {
    id: number;
    gateway: string;
    transactionDate: string;
    accountNumber: string;
    code: any;
    content: string;
    transferType: string;
    transferAmount: number;
    accumulated: number;
    subAccount: any;
    referenceCode: string;
    description: string;
}
