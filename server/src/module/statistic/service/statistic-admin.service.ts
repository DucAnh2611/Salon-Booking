import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import {
    OrderPaymentStatusEnum,
    OrderPaymentTypeEnum,
    OrderStatusEnum,
    OrderType,
} from '../../../common/enum/order.enum';
import { ClientEntity } from '../../client/entity/client.entity';
import { EmployeeEntity } from '../../employee/entity/employee.entity';
import { OrderEntity } from '../../order-base/entity/order-base.entity';
import { OrderProductItemEntity } from '../../order-product-item/entity/order-product-item.entity';
import { OrderServiceItemEntity } from '../../order-service-item/entity/order-service-item.entity';
import { OrderTransactionEntity } from '../../order-transaction/entity/order-transaction.entity';
import { ProductBaseEntity } from '../../product-base/entity/product-base.entity';
import { ProductTypesEntity } from '../../product-types/entity/product-types.entity';
import { ServiceEntity } from '../../service-base/entity/service.entity';
import { ServiceEmpleeEntity } from '../../service-employee/entity/service-employee.entity';
import { StatisticDashboardDto } from '../dto/statistic-dashboard.dto';

@Injectable()
export class StatisticAdminService {
    constructor(
        @InjectRepository(ProductBaseEntity) private readonly productRepo: Repository<ProductBaseEntity>,
        @InjectRepository(ProductTypesEntity) private readonly productTypeRepo: Repository<ProductTypesEntity>,
        @InjectRepository(EmployeeEntity) private readonly empRepo: Repository<EmployeeEntity>,
        @InjectRepository(ServiceEntity) private readonly serviceRepo: Repository<ServiceEntity>,
        @InjectRepository(ServiceEmpleeEntity) private readonly serviceEmployeeRepo: Repository<ServiceEmpleeEntity>,
        @InjectRepository(OrderEntity) private readonly orderRepo: Repository<OrderEntity>,
        @InjectRepository(ClientEntity) private readonly clientRepo: Repository<ClientEntity>,
        @InjectRepository(OrderTransactionEntity) private readonly transactionRepo: Repository<OrderTransactionEntity>,
        @InjectRepository(OrderServiceItemEntity)
        private readonly orderServiceItemRepo: Repository<OrderServiceItemEntity>,
        @InjectRepository(OrderProductItemEntity)
        private readonly orderProductItemRepo: Repository<OrderProductItemEntity>,
    ) {}

    async dashboard(employeeId: string, body: StatisticDashboardDto) {
        const { month, year } = body;

        let createWhere: any = {};
        const startDate = new Date(year, (month || 1) - 1, 1);
        const endDate = new Date(year, month || 12, 0);

        // startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() + 1);

        createWhere = {
            createdAt: Between(startDate, endDate),
        };

        const orderInTime = await this.orderRepo.find({
            where: { ...createWhere, status: In([OrderStatusEnum.FINISH, OrderStatusEnum.RECEIVED]) },
            loadEagerRelations: false,
        });

        const [sumCashOrder, sumTransactionOrder] = await Promise.all([
            orderInTime
                .filter(i => i.paymentType === OrderPaymentTypeEnum.CASH)
                .reduce((sum, curr) => {
                    return sum + curr.totalPaid;
                }, 0),
            this.transactionRepo.sum('orderAmount', {
                orderId: In(orderInTime.filter(i => i.paymentType === OrderPaymentTypeEnum.BANK).map(item => item.id)),
                status: OrderPaymentStatusEnum.PAID,
                ...createWhere,
            }),
        ]);

        const [totalProducts, totalServices, totalOrders, totalIncome] = await Promise.all([
            this.productRepo.count({
                where: {
                    ...createWhere,
                },
                loadEagerRelations: false,
            }),
            this.serviceRepo.count({
                where: {
                    ...createWhere,
                },
                loadEagerRelations: false,
            }),
            this.orderRepo.count({
                where: {
                    ...createWhere,
                },
                loadEagerRelations: false,
            }),
            sumCashOrder + sumTransactionOrder,
        ]);

        const [orderCount, orderCountDetail] = await Promise.all([
            this.orderRepo.count({ where: { ...createWhere }, loadEagerRelations: false }),
            this.orderRepo
                .createQueryBuilder('order')
                .select('order.status', 'status')
                .addSelect('COUNT(*)', 'count')
                .groupBy('order.status')
                .where('order.createdAt BETWEEN :startDate AND :endDate', {
                    startDate: startDate,
                    endDate: endDate,
                })
                .getRawMany(),
        ]);

        const successOrderService = await this.orderRepo.find({
            where: { ...createWhere, type: OrderType.SERVICE, status: OrderStatusEnum.FINISH },
            loadEagerRelations: false,
        });

        let mostEmployeeBooked = [];

        if (successOrderService.length) {
            mostEmployeeBooked = await this.orderServiceItemRepo
                .createQueryBuilder('orderService')
                .select('orderService.employeeId', 'employeeId')
                .addSelect('COUNT(orderService.employeeId)', 'count')
                .groupBy('orderService.employeeId')
                .where('orderService.orderId IN (:...orders)', { orders: successOrderService.map(item => item.id) })
                .orderBy('COUNT(orderService.id)', 'DESC')
                .take(10)
                .getRawMany();

            mostEmployeeBooked = await Promise.all(
                mostEmployeeBooked.map(async employeeOrder => {
                    const snapShot = await this.serviceEmployeeRepo.findOne({
                        where: { employeeId: employeeOrder.employeeId },
                        loadEagerRelations: false,
                        relations: {
                            employee: {
                                userBase: {
                                    userAvatar: true,
                                },
                                eRole: true,
                            },
                        },
                    });
                    return {
                        ...employeeOrder,
                        employeeSnapshot: snapShot,
                    };
                }),
            );
        } else {
            mostEmployeeBooked = [];
        }

        const successOrderProduct = await this.orderRepo.find({
            where: { ...createWhere, type: OrderType.PRODUCT, status: OrderStatusEnum.RECEIVED },
            loadEagerRelations: false,
        });

        let mostProductSold = [];

        if (successOrderProduct.length) {
            const query = this.orderProductItemRepo
                .createQueryBuilder('orderProduct')
                .select('orderProduct.productId', 'productId')
                .addSelect('orderProduct.productTypeId', 'productTypeId')
                .addSelect('SUM(orderProduct.quantity)', 'count')
                .groupBy('orderProduct.productId')
                .addGroupBy('orderProduct.productTypeId')
                .where('orderProduct.orderId IN (:...orders)', { orders: successOrderProduct.map(item => item.id) })
                .orderBy('SUM(orderProduct.quantity)', 'DESC')
                .take(10)
                .distinct(true);

            mostProductSold = await query.getRawMany();

            mostProductSold = await Promise.all(
                mostProductSold.map(async productOrder => {
                    const snapShot = await this.productRepo.findOne({
                        where: { id: productOrder.productId },
                        loadEagerRelations: false,
                        relations: {
                            productMedia: {
                                media: true,
                            },
                            category: true,
                        },
                    });
                    let typeSnapShot = null;
                    if (productOrder.productTypeId) {
                        typeSnapShot = await this.productTypeRepo.findOne({
                            where: { id: productOrder.productTypeId },
                            loadEagerRelations: false,
                            relations: {
                                productTypesAttribute: {
                                    value: {
                                        attribute: true,
                                    },
                                },
                            },
                        });
                    }

                    return {
                        ...productOrder,
                        productSnapshot: snapShot,
                        productTypeSnapshot: typeSnapShot,
                    };
                }),
            );
        } else {
            mostProductSold = [];
        }

        let mostServiceBooked = [];

        if (successOrderService.length) {
            mostServiceBooked = await this.orderServiceItemRepo
                .createQueryBuilder('orderService')
                .select('orderService.serviceId', 'serviceId')
                .addSelect('COUNT(orderService.serviceId)', 'count')
                .groupBy('orderService.serviceId')
                .where('orderService.orderId IN (:...orders)', { orders: successOrderService.map(item => item.id) })
                .orderBy('COUNT(orderService.id)', 'DESC')
                .take(10)
                .getRawMany();

            mostServiceBooked = await Promise.all(
                mostServiceBooked.map(async serviceOrder => {
                    const snapShot = await this.serviceRepo.findOne({
                        where: { id: serviceOrder.serviceId },
                        loadEagerRelations: false,
                        relations: {
                            category: true,
                            media: {
                                media: true,
                            },
                            steps: true,
                        },
                    });
                    return {
                        ...serviceOrder,
                        serviceSnapshot: snapShot,
                    };
                }),
            );
        } else {
            mostServiceBooked = [];
        }
        let inComeService = [];
        let inComeProduct = [];
        const groupBy = month ? 'day' : 'month';

        const arrayLength = month ? new Date(year, month, 0).getDate() : 12;

        if (month) {
            inComeService = await this.orderRepo
                .createQueryBuilder('order')
                .select('EXTRACT(DAY FROM order.createdAt)', 'day')
                .addSelect('SUM(order.total)', 'total')
                .where('EXTRACT(YEAR FROM order.createdAt) = :year', { year: year })
                .andWhere('EXTRACT(MONTH FROM order.createdAt) = :month', { month: month })
                .andWhere('order.type = :type', { type: OrderType.SERVICE })
                .andWhere('order.status = :status', { status: OrderStatusEnum.FINISH })
                .groupBy('EXTRACT(DAY FROM order.createdAt)')
                .orderBy('day', 'ASC')
                .getRawMany();

            inComeProduct = await this.orderRepo
                .createQueryBuilder('order')
                .select('EXTRACT(DAY FROM order.createdAt)', 'day')
                .addSelect('SUM(order.total)', 'total')
                .where('EXTRACT(YEAR FROM order.createdAt) = :year', { year: year })
                .andWhere('EXTRACT(MONTH FROM order.createdAt) = :month', { month: month })
                .andWhere('order.type = :type', { type: OrderType.PRODUCT })
                .andWhere('order.status = :status', { status: OrderStatusEnum.RECEIVED })
                .groupBy('EXTRACT(DAY FROM order.createdAt)')
                .orderBy('day', 'ASC')
                .getRawMany();
        } else {
            inComeService = await this.orderRepo
                .createQueryBuilder('order')
                .select('EXTRACT(MONTH FROM order.createdAt)', 'month')
                .addSelect('SUM(order.total)', 'total')
                .where('EXTRACT(YEAR FROM order.createdAt) = :year', { year: year })
                .andWhere('order.type = :type', { type: OrderType.SERVICE })
                .andWhere('order.status = :status', { status: OrderStatusEnum.FINISH })
                .groupBy('EXTRACT(MONTH FROM order.createdAt)')
                .orderBy('month', 'ASC')
                .getRawMany();

            inComeProduct = await this.orderRepo
                .createQueryBuilder('order')
                .select('EXTRACT(MONTH FROM order.createdAt)', 'month')
                .addSelect('SUM(order.total)', 'total')
                .where('EXTRACT(YEAR FROM order.createdAt) = :year', { year: year })
                .andWhere('order.type = :type', { type: OrderType.PRODUCT })
                .andWhere('order.status = :status', { status: OrderStatusEnum.RECEIVED })
                .groupBy('EXTRACT(MONTH FROM order.createdAt)')
                .orderBy('month', 'ASC')
                .getRawMany();
        }

        const resultService = Array.from({ length: arrayLength }, (_, index) => ({
            [groupBy]: index + 1,
            service: 0,
            product: 0,
        }));

        inComeService.forEach(order => {
            const unit = parseInt(order[groupBy]);
            resultService[unit - 1].service = parseFloat(order.total);
        });

        inComeProduct.forEach(order => {
            const unit = parseInt(order[groupBy]);
            resultService[unit - 1].product = parseFloat(order.total);
        });

        return {
            start: startDate,
            end: endDate,

            totalIncome,
            totalOrders,
            totalProducts,
            totalServices,
            order: {
                orderCountDetail,
                orderCount,
            },
            service: {
                mostEmployeeBooked,
                mostServiceBooked,
            },
            product: {
                mostProductSold,
            },
            income: {
                groupBy,
                data: resultService,
            },
        };
    }
}
