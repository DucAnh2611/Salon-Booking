import { FindOptionsWhere } from 'typeorm';
import { TBaseExist } from '../../../common/type/exist.type';
import { ClientEntity } from '../../client/entity/client.entity';
import { ETypeExistAuth } from '../enum/auth.enum';

export type TExistEmployee = TBaseExist & {
    username?: string;
};
export type TExistClient = FindOptionsWhere<ClientEntity>;

export type TExistAuth = {
    type: ETypeExistAuth;
    query: TExistClient | TExistEmployee;
};
