export const trimStringInObject = <T>(obj: T) => {
    return Object.entries(obj).reduce<T>((acc: T, curr) => {
        const [field, value] = curr;
        if (typeof value === 'string') {
            acc[field] = value.trim();
        } else {
            acc[field] = value;
        }
        return acc;
    }, {} as T);
};
