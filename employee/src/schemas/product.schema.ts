import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { z } from "zod";

export const productMediaIdSchema = z.object({
    id: z.string().min(1, "Id sản phẩm"),
    isThumbnail: z.boolean().default(false),
});

export const productMediaUrlSchema = z.object({
    url: z.string().min(1, "Đường dẫn ảnh sản phẩm"),
    isThumbnail: z.boolean().default(false),
});

export const productTypeDetailSchema = z.object({
    attrId: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Id thuộc tính") }),
    attrName: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Tên thuộc tính") }),
    value: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Giá trị thuộc tính") }),
    level: z.coerce
        .number({ message: ZOD_MESSAGE.number("Cấp thuộc tính") })
        .int({ message: ZOD_MESSAGE.int("Cấp thuộc tính") })
        .gt(0, { message: ZOD_MESSAGE.positive("Cấp thuộc tính") }),
});

export const createProductBaseSchema = z.object({
    name: z.string().min(2, { message: ZOD_MESSAGE.min(2, "Tên sản phẩm") }),
    description: z.string().optional(),
    thumbnailIds: z.array(productMediaIdSchema).optional(),
    thumbnailUrls: z.array(productMediaUrlSchema).optional(),
    quantity: z.coerce
        .number({ message: ZOD_MESSAGE.number("Số lượng") })
        .int({ message: ZOD_MESSAGE.int("Số lượng") })
        .gt(0, { message: ZOD_MESSAGE.positive("Số lượng") }),
    price: z.coerce
        .number({ message: ZOD_MESSAGE.number("Giá") })
        .int({ message: ZOD_MESSAGE.int("Số lượng") })
        .gt(0, { message: ZOD_MESSAGE.positive("Giá") }),
    categoryId: z.string().min(1, { message: ZOD_MESSAGE.require("Danh mục") }),
    brand: z.string().min(1, { message: ZOD_MESSAGE.require("Hãng hiệu") }),
    sku: z.string().optional(),
});

export const createProductTypeSchema = z.object({
    types: z.array(productTypeDetailSchema),
    quantity: z.coerce
        .number({ message: ZOD_MESSAGE.number("Số lượng kiểu loại") })
        .int({ message: ZOD_MESSAGE.int("Số lượng kiểu loại") })
        .positive({ message: ZOD_MESSAGE.positive("Số lượng kiểu loại") }),
    price: z.coerce
        .number({ message: ZOD_MESSAGE.number("Giá kiểu loại") })
        .int({ message: ZOD_MESSAGE.int("Giá kiểu loại") })
        .positive({ message: ZOD_MESSAGE.positive("Giá kiểu loại") }),
    sku: z.string().optional(),
});

export const createProductDetailSchema = z.object({
    key: z.string().min(1, { message: ZOD_MESSAGE.require("Tên mô tả") }),
    value: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Giá trị của mô tả") }),
});

export const createProductSchema = z.object({
    base: createProductBaseSchema,
    types: z.array(createProductTypeSchema),
    details: z.array(createProductDetailSchema),
});

export const updateProductBaseSchema = z.object({
    name: z.string().min(2, { message: ZOD_MESSAGE.min(2, "Tên sản phẩm") }),
    description: z.string().optional(),
    thumbnailIds: z.array(productMediaIdSchema).optional(),
    thumbnailUrls: z.array(productMediaUrlSchema).optional(),
    quantity: z.coerce
        .number({ message: ZOD_MESSAGE.number("Số lượng") })
        .int({ message: ZOD_MESSAGE.int("Số lượng") })
        .gt(0, { message: ZOD_MESSAGE.positive("Số lượng") }),
    price: z.coerce
        .number({ message: ZOD_MESSAGE.number("Giá") })
        .int({ message: ZOD_MESSAGE.int("Số lượng") })
        .gt(0, { message: ZOD_MESSAGE.positive("Giá") }),
    categoryId: z.string().min(1, { message: ZOD_MESSAGE.require("Danh mục") }),
    brand: z.string().min(1, { message: ZOD_MESSAGE.require("Hãng hiệu") }),
    sku: z.string().default(""),
});

export const updateProductDetailSchema = z.object({
    id: z.string().optional(),
    key: z.string().min(1, { message: ZOD_MESSAGE.require("Tên mô tả") }),
    value: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Giá trị của mô tả") }),
});

export const updateProductTypeSchema = z.object({
    types: z.array(productTypeDetailSchema),
    productTypeId: z.string().optional(),
    quantity: z.coerce
        .number({ message: ZOD_MESSAGE.number("Số lượng kiểu loại") })
        .int({ message: ZOD_MESSAGE.int("Số lượng kiểu loại") })
        .positive({ message: ZOD_MESSAGE.positive("Số lượng kiểu loại") }),
    price: z.coerce
        .number({ message: ZOD_MESSAGE.number("Giá kiểu loại") })
        .int({ message: ZOD_MESSAGE.int("Giá kiểu loại") })
        .positive({ message: ZOD_MESSAGE.positive("Giá kiểu loại") }),
    sku: z.string().default(""),
});

export const updateProductSchema = z.object({
    productId: z.string(),
    base: updateProductBaseSchema,
    details: z.array(updateProductDetailSchema),
    types: z.array(updateProductTypeSchema),
});
