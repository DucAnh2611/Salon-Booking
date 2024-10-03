import { OrderStatusEnum } from '../enum/order.enum';

export const ORDER_STATE_PRODUCT: Record<'normal' | 'cancel', Record<'staff' | 'client', Array<OrderStatusEnum>>> = {
    normal: {
        staff: [
            OrderStatusEnum.CALL_CONFIRM,
            OrderStatusEnum.PROCESSING,
            OrderStatusEnum.SHIPPING,
            OrderStatusEnum.SHIPPED,
        ],
        client: [OrderStatusEnum.RECEIVED, OrderStatusEnum.RETURNED],
    },
    cancel: { staff: [OrderStatusEnum.REFUNDED], client: [OrderStatusEnum.CANCELLED] },
};

export const ORDER_STATE_SERVICE: Record<'normal' | 'cancel', Record<'staff' | 'client', Array<OrderStatusEnum>>> = {
    normal: {
        staff: [OrderStatusEnum.CALL_CONFIRM, OrderStatusEnum.ON_SERVICE, OrderStatusEnum.FINISH],
        client: [OrderStatusEnum.FINISH],
    },
    cancel: { staff: [OrderStatusEnum.REFUNDED], client: [OrderStatusEnum.CANCELLED] },
};

export const CAN_CANCEL_LIST = [OrderStatusEnum.PENDING, OrderStatusEnum.PENDING_PAYMENT, OrderStatusEnum.PAID_PAYMENT];

export const CAN_RETURN_LIST = [OrderStatusEnum.SHIPPED];

export const CAN_FINISH_LIST = [OrderStatusEnum.FINISH];

export const FAIL_STATE_LIST = [OrderStatusEnum.RETURNED, OrderStatusEnum.REFUNDED, OrderStatusEnum.CANCELLED];

export const CAN_NOT_UPDATE_STATE_LIST = [
    ...CAN_CANCEL_LIST,
    ...FAIL_STATE_LIST,
    ...CAN_RETURN_LIST,
    ...CAN_FINISH_LIST,
    OrderStatusEnum.RECEIVED,
];

export const TAX_RATE = 0.08;
