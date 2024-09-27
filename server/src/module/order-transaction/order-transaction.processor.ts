import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { OrderTransactionService } from './order-transaction.service';

@Processor('payment_cancel')
export class OrderTransactionProcessor {
    constructor(private readonly orderTransactionService: OrderTransactionService) {}

    @Process({ name: 'cancelPayment', concurrency: 1 })
    async handleCancelPayment(job: Job<any>) {
        const { id, paidAmount, paymentTransactions } = job.data;

        await this.orderTransactionService.cancelTransaction(id, paidAmount, paymentTransactions);
    }
}
