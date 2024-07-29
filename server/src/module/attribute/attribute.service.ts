import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { SortByEnum } from '../../common/enum/query.enum';
import { BadRequest, NotFound, ServerInternal } from '../../shared/exception/error.exception';
import { ParseOrderString } from '../../shared/utils/parse-dynamic-queyry.utils';
import { CreateAttributeDto } from './dto/attribute-create.dto';
import { FindAttributeAdminDto } from './dto/attribute-get.dto';
import { UpdateAttributeDto } from './dto/attribute-update.dto';
import { AttributeEntity } from './entity/attribute.entity';

@Injectable()
export class AttributeService {
    constructor(@InjectRepository(AttributeEntity) private readonly attributeRepository: Repository<AttributeEntity>) {}

    async findAdmin(query: FindAttributeAdminDto) {
        const { key, limit, page, orderBy } = query;

        const order = orderBy ? ParseOrderString(orderBy) : { createdAt: SortByEnum.DESC };

        const list = await this.attributeRepository.find({
            where: { name: Like(`%${key || ''}%`) },
            loadEagerRelations: false,
            order: {
                ...order,
            },
            relations: {
                employeeCreate: true,
                employeeUpdate: true,
            },
            take: limit,
            skip: (page - 1) * limit,
        });

        const count = await this.attributeRepository.countBy({ name: Like(`%${key || ''}%`) });

        return {
            limit,
            page,
            items: list,
            count,
        };
    }

    async isValid(id: string) {
        return this.attributeRepository.findOne({ where: { id }, loadEagerRelations: false });
    }

    async create(employeeId: string, newAttr: CreateAttributeDto) {
        const { name, description } = newAttr;
        const exist = await this.isExist(newAttr.name);
        if (exist) {
            throw new BadRequest({ message: DataErrorCodeEnum.EXIST });
        }

        const attrInstance = this.attributeRepository.create({
            name,
            description: description || '',
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        const createdAttr = await this.attributeRepository.save(attrInstance);

        return createdAttr;
    }

    async update(employeeId: string, attrId: string, updateAttr: UpdateAttributeDto) {
        const findAttr = await this.findById(attrId);
        const { name, description } = updateAttr;

        if (!findAttr) {
            throw new NotFound();
        }

        const updatedAttr = await this.attributeRepository.save({
            ...findAttr,
            name: name || findAttr.name,
            description: description || findAttr.description,
            updatedBy: employeeId,
        });

        return updatedAttr;
    }

    async delete(employeeId: string, attrId: string) {
        const exist = await this.findById(attrId);
        if (!exist) {
            throw new NotFound();
        }

        const lastUpdateEmployee = await this.attributeRepository.save({ id: attrId, updatedBy: employeeId });
        if (!lastUpdateEmployee) {
            throw new ServerInternal();
        }

        const deleted = await this.attributeRepository.softDelete({ id: attrId });

        if (!deleted) {
            throw new ServerInternal();
        }

        return true;
    }

    async findById(id: string) {
        return this.attributeRepository.findOneBy({ id });
    }

    async isExist(name: string) {
        const exist = await this.attributeRepository.findOneBy({ name: name });

        return exist;
    }
}
