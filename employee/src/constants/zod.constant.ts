export const ZOD_MESSAGE = {
    min: (min: number, type: string) => `${type} phải có it nhất ${min} ký tự.`,
    max: (max: number, type: string) => `${type} có tối đa ${max} ký tự.`,
    phone: "Số điện thoại không đúng định dạng.",
    require: (type: string) => `${type} không được để trống.`,
    int: (type: string) => `${type} phải là số nguyên.`,
    positive: (type: string) => `${type} phải là số dương.`,
    number: (type: string) => `${type} phải là số.`,
};
