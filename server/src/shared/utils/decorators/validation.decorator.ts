import {
    IsArray,
    IsBoolean,
    IsEmail,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsNotIn,
    IsOptional,
    IsString,
    IsUUID,
    Max,
    Min,
    NotEquals,
    Validate,
    ValidateIf,
    ValidationOptions,
} from 'class-validator';
import { IsAfterConstraint } from '../validators/date-comparison.validation';
import { IsDateFormatValidator } from '../validators/is-date-format.validator';
import { IsDivisibleByValidator } from '../validators/is-divisible.validator';
import { IsExist } from '../validators/is-exists.validator';
import { IsMatch } from '../validators/is-match.validator';
import { IsNotExist } from '../validators/is-not-exists.validator';

export type ParamsType = {
    ruleOptions?: Record<string, string>;
    entity?: string[];
    number?: number;
    value?: readonly (string | number | null)[];
    validationOptions?: ValidationOptions;
};

// Define validation rule usage
const validationRules = {
    required: (params?: ParamsType) => IsNotEmpty(params?.validationOptions),
    email: (params?: ParamsType) => IsEmail(params?.ruleOptions, params?.validationOptions),
    string: (params?: ParamsType) => IsString(params?.validationOptions),
    optional: (params?: ParamsType) => IsOptional(params?.validationOptions),
    int: (params?: ParamsType) => IsInt(params?.validationOptions),
    isExist: (params?: ParamsType) => Validate(IsExist, params?.entity, params?.validationOptions),
    isNotExist: (params?: ParamsType) => Validate(IsNotExist, params?.entity, params?.validationOptions),
    min: (params?: ParamsType) => Min(params?.number ?? 0, params?.validationOptions),
    boolean: (params?: ParamsType) => IsBoolean(params?.validationOptions),
    isIn: (params?: ParamsType) => IsIn(params?.value ?? [], params?.validationOptions),
    isNotIn: (params?: ParamsType) => IsNotIn(params?.value ?? [], params?.validationOptions),
    isDateFormat: (params?: ParamsType) => Validate(IsDateFormatValidator, params?.entity, params?.validationOptions),
    match: (params?: ParamsType) =>
        Validate(IsMatch, [new RegExp(params?.ruleOptions?.pattern ?? '')], params?.validationOptions),
    max: (params?: ParamsType) => Max(params?.number ?? 0, params?.validationOptions),
    array: (params?: ParamsType) => IsArray(params?.validationOptions),
    isDivisibleBy: (params?: ParamsType) =>
        Validate(IsDivisibleByValidator, [params?.number ?? 1, params?.validationOptions]),
    isAfter: (params?: ParamsType) =>
        Validate(IsAfterConstraint, [params?.ruleOptions?.property ?? ''], params?.validationOptions),
    uuid: (params?: ParamsType) => IsUUID(4, params?.validationOptions),
    notNull: (params?: ParamsType) => (object: object, propertyName: string) => {
        ValidateIf((_, value) => value !== undefined)(object, propertyName);
        NotEquals(null, params?.validationOptions)(object, propertyName);
    },
};

export const ValidationDecorator = (rules: { rule: string; params?: ParamsType }[]): PropertyDecorator => {
    const decorators = rules.map(({ rule, params }) => {
        return validationRules[rule](params);
    });

    return function (target: object, propertyKey: string | symbol) {
        decorators.forEach(decorator => {
            decorator(target, propertyKey);
        });
    };
};
