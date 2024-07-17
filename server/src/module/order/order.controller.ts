import { Controller, Get } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('test')
export class OrderController {
    constructor(private readonly orderService: OrderService) {}

    @Get('')
    test() {
        return this.orderService.test();
    }
}
