import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { MediaEntity } from '../../media/entity/media.entity';
import { ServiceEntity } from '../../service-base/entity/service.entity';

@Entity('service_media')
export class ServiceMediaEntity {
    @PrimaryColumn('uuid')
    serviceId: string;

    @PrimaryColumn('uuid')
    mediaId: string;

    @Column('boolean')
    isThumbnail: boolean;

    @ManyToOne(() => ServiceEntity, (serviceEntity: ServiceEntity) => serviceEntity.media)
    @JoinColumn({ name: 'serviceId' })
    service: ServiceEntity;

    @ManyToOne(() => MediaEntity, (mediaEntity: MediaEntity) => mediaEntity.serviceMedia)
    @JoinColumn({ name: 'mediaId' })
    media: MediaEntity;
}
