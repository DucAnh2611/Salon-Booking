import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DataSuccessCodeEnum } from '../../../common/enum/data-success-code.enum';
import { SortByEnum } from '../../../common/enum/query.enum';
import { SearchClientDto } from '../dto/client-get.dto';
import { ClientUpdateLockDto } from '../dto/client-update.dto';
import { ClientEntity } from '../entity/client.entity';

@Injectable()
export class ClientAdminService {
    constructor(@InjectRepository(ClientEntity) private readonly clientRepository: Repository<ClientEntity>) {}

    async list(body: SearchClientDto) {
        const { filter, order, limit = 10, page = 1 } = body;

        const { name, email, phone, ...lockInfo } = filter;

        const queryBuilder = this.clientRepository.createQueryBuilder('c');

        queryBuilder.leftJoinAndSelect('c.userBase', 'u').leftJoinAndSelect('u.userAvatar', 'ua').where('TRUE');

        Object.entries(lockInfo).forEach(([key, value]) => {
            queryBuilder.andWhere(`c.${key} = :${key}`, { [key]: String(value) === 'true' });
        });

        if (name) {
            queryBuilder.andWhere(
                "CONCAT(u.firstname, ' ', u.lastname) ILIKE :name OR CONCAT(u.lastname, ' ', u.firstname) ILIKE :name",
                { name: `%${name}%` },
            );
        }
        if (email) {
            queryBuilder.andWhere('c.email ILIKE :email', { email: `%${email}%` });
        }
        if (phone) {
            queryBuilder.andWhere('u.phone ILIKE :phone', { phone: `%${phone}%` });
        }

        queryBuilder.orderBy('c.createdAt', 'DESC');

        Object.entries(order).forEach(([key, sort]: [key: keyof typeof order, sort: SortByEnum]) => {
            queryBuilder.addOrderBy(`c.${key}`, sort);
        });

        const [items, count] = await Promise.all([
            queryBuilder
                .take(limit)
                .skip((page - 1) * limit)
                .getMany(),
            queryBuilder.getCount(),
        ]);

        return {
            items: items,
            page,
            limit,
            count,
        };
    }

    async updateLock(body: ClientUpdateLockDto) {
        const { clientId, lockAccount, lockOrder } = body;

        await this.clientRepository.update(
            { id: clientId },
            {
                ...(lockAccount !== undefined ? { lockAccount } : {}),
                ...(lockOrder !== undefined ? { lockOrder } : {}),
            },
        );

        return DataSuccessCodeEnum.OK;
    }
}
