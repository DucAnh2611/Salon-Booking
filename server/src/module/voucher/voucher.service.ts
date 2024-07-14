import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
    FindOptionsOrder,
    FindOptionsWhere,
    In,
    LessThan,
    LessThanOrEqual,
    Like,
    MoreThan,
    MoreThanOrEqual,
    Not,
    Repository,
} from 'typeorm';
import { DataErrorCodeEnum } from '../../common/enum/data-error-code.enum';
import { DataSuccessCodeEnum } from '../../common/enum/data-success-code.enum';
import { OperatorEnum } from '../../common/enum/query.enum';
import { BadRequest } from '../../shared/exception/error.exception';
import { ParseFilterQuery, ParseSortQuery, TParsedFilterValue } from '../../shared/utils/parse-dynamic-queyry.utils';
import { CreateVoucherDto } from './dto/voucher-create.dto';
import { VoucherFindFilterDto, VoucherFindQueryDto } from './dto/voucher-get.dto';
import { UpdateVoucherDto } from './dto/voucher-update.dto';
import { VoucherEntity } from './entity/voucher.entity';

@Injectable()
export class VoucherService {
    constructor(@InjectRepository(VoucherEntity) private readonly voucherRepository: Repository<VoucherEntity>) {}

    async find(query: VoucherFindQueryDto) {
        const { limit, page, filter, sort } = query;
        let where = {};
        let order = {};

        if (filter) {
            const parsed = ParseFilterQuery<VoucherFindFilterDto>(filter);
            where = Object.entries(parsed).reduce(
                (acc: FindOptionsWhere<VoucherEntity>, [field, obj]: [field: string, obj: TParsedFilterValue]) => {
                    const { operator, value } = obj;
                    switch (operator) {
                        case OperatorEnum.IN:
                            acc[field] = In(value as string[]);
                            break;
                        case OperatorEnum.GTE:
                            acc[field] = MoreThanOrEqual(value);
                            break;
                        case OperatorEnum.GT:
                            acc[field] = MoreThan(value);
                            break;
                        case OperatorEnum.E:
                            acc[field] = value;
                            break;
                        case OperatorEnum.NE:
                            acc[field] = Not(value);
                            break;
                        case OperatorEnum.L:
                            acc[field] = LessThan(value);
                            break;
                        case OperatorEnum.LE:
                            acc[field] = LessThanOrEqual(value);
                            break;
                        case OperatorEnum.STW:
                            acc[field] = Like(`${value}%`);
                            break;
                        case OperatorEnum.EW:
                            acc[field] = Like(`%${value}`);
                            break;
                        case OperatorEnum.CT:
                            acc[field] = Like(`%${value}%`);
                            break;
                    }
                    return acc;
                },
                {} as FindOptionsWhere<VoucherEntity>,
            );
        }

        if (sort) {
            const parsed = ParseSortQuery<VoucherEntity>(sort);
            order = Object.entries(parsed).reduce((acc: FindOptionsOrder<VoucherEntity>, [field, value]) => {
                acc[field] = value;
                return acc;
            }, {} as FindOptionsOrder<VoucherEntity>);
        }

        return this.voucherRepository.find({ where, order, skip: (page - 1) * limit, take: limit });
    }

    async create(employeeId: string, body: CreateVoucherDto) {
        const codeExist = await this.codeExist(body.code);

        if (codeExist) {
            throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_VOUCHER });
        }

        if (body.endAt && body.endAt.getTime() - body.startAt.getTime() <= 0) {
            throw new BadRequest({ message: DataErrorCodeEnum.INVALID_END_TIME });
        }

        const voucherInstance = this.voucherRepository.create({
            ...body,
            createdBy: employeeId,
            updatedBy: employeeId,
        });

        const createdVoucher = await this.voucherRepository.save(voucherInstance);

        return createdVoucher;
    }

    async update(employeeId: string, voucherId: string, body: UpdateVoucherDto) {
        const voucherExist = await this.voucherExist(voucherId);
        if (body.code) {
            const codeExist = await this.codeExist(body.code);

            if (codeExist) {
                throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_VOUCHER });
            }
        }

        const newVoucherInfo = {
            ...voucherExist,
            ...body,
        };

        const updatedVoucher = await this.voucherRepository.save({ ...newVoucherInfo, updatedBy: employeeId });

        return updatedVoucher;
    }

    async delete(employeeId: string, voucherId: string) {
        const exist = await this.voucherExist(voucherId);

        const deleted = await this.voucherRepository.softDelete(voucherId);

        return DataSuccessCodeEnum.OK;
    }

    async deleteMany(employeeId: string, voucherIds: string[]) {
        await Promise.all(voucherIds.map(voucherId => this.delete(employeeId, voucherId)));

        return DataSuccessCodeEnum.OK;
    }

    async toggleActive(employeeId: string, voucherId: string) {
        const voucher = await this.voucherExist(voucherId);

        const toggle = !voucher.isActive;

        const toggleVoucher = await this.voucherRepository.save({
            ...voucher,
            isActive: toggle,
            updatedBy: employeeId,
        });

        return toggleVoucher;
    }

    async voucherExist(id: string) {
        const voucher = await this.voucherRepository.findOneBy({ id });
        if (voucher) {
            throw new BadRequest({ message: DataErrorCodeEnum.NOT_EXIST_VOUCHER });
        }
        return this.voucherRepository.findOneBy({ id });
    }

    async checkValid(voucherId: string) {
        const voucher = await this.voucherExist(voucherId);

        //TODO - add count usage for used voucher base on order
        const countUsage = 0;

        if (voucher.usageLimit === countUsage) {
            throw new BadRequest({ message: DataErrorCodeEnum.OUT_OF_USAGE_VOUCHER });
        }

        if (voucher.endAt.getTime() <= Date.now()) {
            throw new BadRequest({ message: DataErrorCodeEnum.EXISTED_VOUCHER });
        }

        return true;
    }

    codeExist(code: string) {
        return this.voucherRepository.findOneBy({ code });
    }
}
