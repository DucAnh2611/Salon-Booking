import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../../common/enum/data-success-code.enum';
import { SortByEnum } from '../../../common/enum/query.enum';
import { multerConfig } from '../../../config/multer.configs';
import { BadRequest } from '../../../shared/exception/error.exception';
import { joinString } from '../../../shared/utils/string';
import { MediaService } from '../../media/service/media.service';
import { OrganizationCreateDto } from '../dto/organization-create.dto';
import { OrganizationListDto } from '../dto/organization-get.dto';
import { OrganizationShowDto, OrganizationUpdateDto } from '../dto/organization-update.dto';
import { OrganizationEntity } from '../entity/organization.entity';
import { OrganizationGateway } from '../gateway/organization.gateway';

@Injectable()
export class OrganizationAdminService {
    constructor(
        @InjectRepository(OrganizationEntity) private readonly organizationRepository: Repository<OrganizationEntity>,
        private readonly mediaService: MediaService,
        private readonly organizationGateway: OrganizationGateway,
    ) {}

    current() {
        return this.organizationRepository.findOne({
            where: { isShow: true },
            loadEagerRelations: false,
            relations: { logo: true },
        });
    }

    async detail(organizationId: string) {
        const organization = await this.organizationRepository.findOne({
            where: { id: organizationId },
            loadEagerRelations: false,
            relations: {
                logo: true,
                userUpdate: {
                    eRole: true,
                    userBase: {
                        userAvatar: true,
                    },
                },
                userCreate: {
                    eRole: true,
                    userBase: {
                        userAvatar: true,
                    },
                },
            },
        });
        if (!organization) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORGANIZATION });
        }

        return organization;
    }

    async create(userId: string, employeeId: string, body: OrganizationCreateDto) {
        const { logoUrl, ...newOrganization } = body;

        const logoMedia = await this.mediaService.getMediaFromPath(logoUrl);
        if (!logoMedia) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
        }

        const savedLogo = await this.mediaService.save(
            userId,
            logoMedia.file,
            joinString({ joinString: '/', strings: [multerConfig.organization] }),
        );

        const instance = this.organizationRepository.create({
            ...body,
            logoId: savedLogo.id,
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        return this.organizationRepository.save(instance);
    }

    async update(userId: string, employeeId: string, body: OrganizationUpdateDto) {
        const { organizationId, logoUrl, logoId, ...updateInfo } = body;

        let newLogoId = logoId;

        if (logoUrl) {
            const logoMedia = await this.mediaService.getMediaFromPath(logoUrl);
            if (!logoMedia) {
                throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_MEDIA });
            }

            const savedLogo = await this.mediaService.save(
                userId,
                logoMedia.file,
                joinString({ joinString: '/', strings: [multerConfig.organization] }),
            );
            newLogoId = savedLogo.id;
        }

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
                logoId: newLogoId,
                updatedBy: employeeId,
            },
        );

        this.organizationGateway.updateCurrent();

        return DataSuccessCodeEnum.OK;
    }

    async remove(organizationId: string) {
        await this.organizationRepository.softDelete(organizationId);

        return DataSuccessCodeEnum.OK;
    }

    async selectShow(employeeId: string, body: OrganizationShowDto) {
        const { organizationId, show } = body;
        const organization = await this.organizationRepository.findOne({
            where: { id: organizationId },
            loadEagerRelations: false,
        });

        if (!organization) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_ORGANIZATION });
        }

        if (organization.isShow === show) {
            return DataSuccessCodeEnum.OK;
        }

        if (show) {
            await this.organizationRepository.update({ id: Not(organizationId) }, { isShow: false });
        }

        await this.organizationRepository.update(organization.id, {
            isShow: show,
            updatedBy: employeeId,
        });

        return DataSuccessCodeEnum.OK;
    }

    async list(body: OrganizationListDto) {
        const { limit = 10, page = 1 } = body;
        const [items, count] = await this.organizationRepository.findAndCount({
            loadEagerRelations: false,
            where: {},
            take: limit,
            skip: (page - 1) * limit,
            order: {
                isShow: SortByEnum.DESC,
            },
            relations: {
                logo: true,
            },
        });

        return {
            page,
            limit,
            items,
            count,
        };
    }
}
