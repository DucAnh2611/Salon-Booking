import { SortByEnum } from '../../common/enum/query.enum';
import { DynamicQuery, TParsedQuery } from '../../common/type/query.type';

export const ParseDynamicQuery = (query: DynamicQuery): TParsedQuery => {
    const { filter, limit, page, sort } = query;

    const format = {
        filter: /^(\w+):(.+)$/,
        sort: /^(\w+)_(asc|desc)$/,
    };

    const parsedQuery: TParsedQuery = { filter: {}, limit, page, sort: {} };

    if (filter && !format.filter.test(filter)) {
        const [field, value] = filter.split(':');

        parsedQuery.filter = {
            [field]: value,
        };
    }
    if (sort && !format.sort.test(sort)) {
        const [field, type] = filter.split('_');
        const sortBy: SortByEnum = SortByEnum[type.toLocaleUpperCase()] || SortByEnum.ASC;

        parsedQuery.sort = {
            [field]: sortBy,
        };
    }

    return parsedQuery;
};
