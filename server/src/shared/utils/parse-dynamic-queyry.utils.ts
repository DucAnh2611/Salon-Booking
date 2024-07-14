import { OperatorEnum, SortByEnum } from '../../common/enum/query.enum';
import { DynamicQuery, TParsedQuery } from '../../common/type/query.type';

export const ParseDynamicQuery = (query: DynamicQuery): TParsedQuery => {
    const { filter, limit, page, sort } = query;

    const format = {
        filter: /^(\w+):(.+)$/,
        sort: /^(-|\+)(\w+)$/,
    };

    const parsedQuery: TParsedQuery = { filter: {}, limit, page, sort: {} };

    if (filter && !format.filter.test(filter)) {
        const [field, value] = filter.split(':');

        parsedQuery.filter = {
            [field]: value,
        };
    }
    if (sort && !format.sort.test(sort)) {
        const [type, split, ...parials] = sort.split('');
        const field = parials.join('');

        const sortBy: SortByEnum = (type === '+' ? SortByEnum.ASC : SortByEnum.DESC) || SortByEnum.ASC;

        parsedQuery.sort = {
            [field]: sortBy,
        };
    }

    return parsedQuery;
};

export type TParsedFilterValue = {
    operator: OperatorEnum;
    value: string | number | (string | number)[];
};

export type TParsedFilter<T> = {
    [key in keyof T]: TParsedFilterValue;
};

export type TParsedSort<T> = {
    [key in keyof T]: SortByEnum;
};

export const ParseFilterQuery = <T>(filter: object) => {
    const format = /^(\w+):(.+)$/;

    const mappedFilter: TParsedFilter<Partial<T>> = Object.entries(filter).reduce(
        (acc, [field, value]: [field: string, value: any]) => {
            if (format.test(value)) {
                const [ops, splitValue] = value.split(':');
                acc[field] = {
                    operator: OperatorEnum[ops.toUpperCase()] || OperatorEnum.E,
                    value,
                };
            }

            return acc;
        },
        {} as TParsedFilter<Partial<T>>,
    );

    return mappedFilter;
};

export const ParseSortQuery = <T>(sort: string[]) => {
    const format = /^([-+])(\w+)$/;

    const mappedSort: TParsedSort<Partial<T>> = sort.reduce(
        (acc, curr: string) => {
            const match = curr.match(format);
            if (match) {
                const [word, op, field] = match;
                acc[field] = op === '+' ? SortByEnum.ASC : SortByEnum.DESC;
            }

            return acc;
        },
        {} as TParsedSort<Partial<T>>,
    );

    return mappedSort;
};
