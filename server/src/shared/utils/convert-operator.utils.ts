import { OperatorEnum } from '../../common/enum/query.enum';
import { TFilterBy } from '../../common/type/query.type';

export function ConvertOperator({ field, operator, value }: TFilterBy) {
    const res = {
        where: '',
        value: value,
        field: field,
    };
    switch (operator) {
        case OperatorEnum.IN:
            res.where = `${field} IN (:...${field})`;
            break;
        case OperatorEnum.CONTAINS:
            res.where = `${field} LIKE :${field}`;
            res.value = `%${value}%`;
            break;
        case OperatorEnum.GREATER_OR_EQUAL:
            res.where = `${field} ${OperatorEnum.GREATER_OR_EQUAL} :${field}`;
            break;
        case OperatorEnum.GREATER:
            res.where = `${field} ${OperatorEnum.GREATER} :${field}`;
            break;
        case OperatorEnum.SAME:
            res.where = `${field} ${OperatorEnum.SAME} :${field}`;
            break;
        case OperatorEnum.SMALLER:
            res.where = `${field} ${OperatorEnum.SMALLER} :${field}`;
            break;
        case OperatorEnum.SMALLER_OR_EQUAL:
            res.where = `${field} ${OperatorEnum.SMALLER_OR_EQUAL} :${field}`;
            break;
        default:
            break;
    }
    return res;
}
