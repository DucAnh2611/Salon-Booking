import { OrderStatusEnum } from '../enum/order.enum';

export const ORDER_STATE_PRODUCT: Record<'normal' | 'cancel', Record<'staff' | 'client', Array<OrderStatusEnum>>> = {
    normal: {
        staff: [
            OrderStatusEnum.CONFIRMED,
            OrderStatusEnum.CALL_CONFIRM,
            OrderStatusEnum.PROCESSING,
            OrderStatusEnum.SHIPPING,
            OrderStatusEnum.SHIPPED,
        ],
        client: [OrderStatusEnum.RECEIVED],
    },
    cancel: { staff: [OrderStatusEnum.RETURNED, OrderStatusEnum.REFUNDED], client: [OrderStatusEnum.CANCELLED] },
};

export const ORDER_STATE_SERVICE: Record<'normal' | 'cancel', Record<'staff' | 'client', Array<OrderStatusEnum>>> = {
    normal: {
        staff: [
            OrderStatusEnum.CONFIRMED,
            OrderStatusEnum.CALL_CONFIRM,
            OrderStatusEnum.ARRIVED,
            OrderStatusEnum.ON_SERVICE,
            OrderStatusEnum.PAYING,
        ],
        client: [OrderStatusEnum.FINISH],
    },
    cancel: { staff: [], client: [OrderStatusEnum.CANCELLED] },
};
