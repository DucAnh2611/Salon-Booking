import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../../common/enum/data-success-code.enum';
import { BadRequest } from '../../../shared/exception/error.exception';
import { OrganizationCreateDto } from '../dto/organization-create.dto';
import { OrganizationListDto } from '../dto/organization-get.dto';
import { OrganizationUpdateDto } from '../dto/organization-update.dto';
import { OrganizationEntity } from '../entity/organization.entity';

@Injectable()
export class OrganizationAdminService {
    constructor(
        @InjectRepository(OrganizationEntity) private readonly organizationRepository: Repository<OrganizationEntity>,
    ) {}

    async detail(organizationId: string) {
        const organization = await this.organizationRepository.findOne({
            where: { id: organizationId },
            loadEagerRelations: false,
            relations: { logo: true },
        });
        if (!organization) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORGANIZATION });
        }

        return organization;
    }

    create(employeeId: string, body: OrganizationCreateDto) {
        const instance = this.organizationRepository.create({
            ...body,
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        return this.organizationRepository.save(instance);
    }

    async update(employeeId: string, body: OrganizationUpdateDto) {
        const { organizationId, ...updateInfo } = body;

        const organization = await this.organizationRepository.findOne({
            where: { id: organizationId },
            loadEagerRelations: false,
        });
        if (!organization) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORGANIZATION });
        }

        await this.organizationRepository.update(
            { id: organizationId },
            {
                ...updateInfo,
                updatedBy: employeeId,
            },
        );

        return DataSuccessCodeEnum.OK;
    }

    async remove(organizationId: string) {
        await this.organizationRepository.softDelete(organizationId);

        return DataSuccessCodeEnum.OK;
    }

    async toggle(organizationId: string) {
        const organization = await this.organizationRepository.findOne({
            where: { id: organizationId },
            loadEagerRelations: false,
        });
        if (!organization) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORGANIZATION });
        }

        // if organization is show, toggle to false so check whether there are no organization is show
        if (organization.isShow) {
            const currentShow = await this.organizationRepository.findOne({
                where: { isShow: true, id: Not(organizationId) },
                loadEagerRelations: false,
            });
            if (currentShow) {
                throw new BadRequest({ message: DataErrorCodeEnum.NO_SHOW_ORGANIZATION });
            }
        }

        await this.organizationRepository.update(organization.id, { isShow: !organization.isShow });

        return DataSuccessCodeEnum.OK;
    }

    async list(body: OrganizationListDto) {
        const { page, limit } = body;

        const [items, count] = await this.organizationRepository.findAndCount({
            loadEagerRelations: false,
            where: {},
            take: limit,
            skip: (page - 1) * limit,
        });

        return {
            page,
            limit,
            items,
            count,
        };
    }
}
