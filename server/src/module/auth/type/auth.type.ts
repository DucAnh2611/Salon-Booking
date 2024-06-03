import { TBaseExist } from '../../../common/type/exist.type';
import { ETypeExistAuth } from '../enum/auth.enum';

export type TExistEmployee = TBaseExist & {
    username?: string;
};
export type TExistClient = TBaseExist & {
    email?: string;
};

export type TExistAuth = {
    type: ETypeExistAuth;
    query: TExistClient | TExistEmployee;
};
