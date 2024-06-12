export const MaskObject = ({ maskList, obj }: { maskList: string[] | string; obj: object }) => {
    let maskFields = '';
    if (Array.isArray(maskList)) {
        maskFields = maskList.join(' ');
    }

    const newObj = Object.entries(obj).reduce((acc, curr) => {
        const [field, value] = curr;
        if (!maskFields.includes(field)) {
            acc[field] = value;
        }
        return acc;
    }, {});

    return newObj;
};
