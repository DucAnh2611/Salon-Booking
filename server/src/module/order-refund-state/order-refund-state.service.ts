import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { OrderRefundStatusEnum } from '../../common/enum/order.enum';
import { multerConfig } from '../../config/multer.configs';
import { BadRequest } from '../../shared/exception/error.exception';
import { MediaService } from '../media/service/media.service';
import { CreateOrderRefundStateDto } from './dto/order-refund-state-create.dto';
import { OrderRefundStateEntity } from './entity/order-refund-state.entity';

const AUTO_RECEIVE_HOUR = 24;

@Injectable()
export class OrderRefundStateService {
    constructor(
        @InjectRepository(OrderRefundStateEntity)
        private readonly orderRefundStateRepository: Repository<OrderRefundStateEntity>,
        private readonly mediaService: MediaService,
    ) {}

    getByRequestId(requestId: string) {
        return this.orderRefundStateRepository.find({
            where: { refundRequestId: requestId },
            loadEagerRelations: false,
        });
    }

    getApprovedState(requestId: string) {
        return this.orderRefundStateRepository.findOne({
            where: {
                refundRequestId: requestId,
                status: OrderRefundStatusEnum.APPROVED,
            },
            loadEagerRelations: false,
        });
    }

    async addAutoDecline(requestId: string) {
        const getByRequest = await this.orderRefundStateRepository.findOne({
            where: { refundRequestId: requestId, status: OrderRefundStatusEnum.DECLINE },
            loadEagerRelations: false,
        });
        if (getByRequest) return getByRequest;

        const newRequestStatus = await this.orderRefundStateRepository.save({
            refundRequestId: requestId,
            note: 'Yêu cầu hoàn tiền hết hạn!',
            status: OrderRefundStatusEnum.DECLINE,
        });
        return newRequestStatus;
    }

    async addState(body: CreateOrderRefundStateDto) {
        const { mediaId, mediaUrl, requestId, state, userId, note } = body;
        const instance = this.orderRefundStateRepository.create({
            refundRequestId: requestId,
            note: note || '',
            status: state,
            createdBy: userId,
        });

        if (mediaId) {
            const checkExist = await this.mediaService.isValid(mediaId);
            if (!checkExist) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
            }
            instance.mediaId = mediaId;
        }

        if (mediaUrl) {
            const media = await this.mediaService.getMediaFromPath(mediaUrl);
            if (!media) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
            }
            const savedMedia = await this.mediaService.save(
                userId,
                media.file,
                `${multerConfig.order.base}/${multerConfig.order.refund}/${requestId}`,
            );
            instance.mediaId = savedMedia.id;
        }

        const newRequestStatus = await this.orderRefundStateRepository.save(instance);
        return newRequestStatus;
    }
}
