import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DynamicQuery } from '../../common/type/query.type';
import { BadRequest, NotFound, ServerInternal } from '../../shared/exception/error.exception';
import { CreateAttributeDto } from './dto/attribute-create.dto';
import { UpdateAttributeDto } from './dto/attribute-update.dto';
import { AttributeEntity } from './entity/attribute.entity';

@Injectable()
export class AttributeService {
    constructor(@InjectRepository(AttributeEntity) private readonly attributeRepository: Repository<AttributeEntity>) {}

    async find(query: DynamicQuery) {}

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
