import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrganizationEntity } from '../entity/organization.entity';

@Injectable()
export class OrganizationService {
    constructor(
        @InjectRepository(OrganizationEntity) private readonly organizationRepository: Repository<OrganizationEntity>,
    ) {}

    current() {
        return this.organizationRepository.findOne({
            where: { isShow: true },
            loadEagerRelations: false,
            relations: {
                logo: true,
            },
        });
    }
}
