import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { z } from "zod";

/** @CREATE */
export const productMediaIdSchema = z.object({
    id: z.string().min(1, "Id sản phẩm"),
    isThumbnail: z.boolean().default(false),
});

export const productMediaUrlSchema = z.object({
    url: z.string().min(1, "Đường dẫn ảnh sản phẩm"),
    isThumbnail: z.boolean().default(false),
});

export const createProductTypeAttributeValueSchema = z.object({
    attrValueTempId: z.string(),
    level: z.coerce
        .number({ message: ZOD_MESSAGE.number("Cấp thuộc tính") })
        .int({ message: ZOD_MESSAGE.int("Cấp thuộc tính") })
        .gt(0, { message: ZOD_MESSAGE.positive("Cấp thuộc tính") }),
});

export const createLevelAttributeValueSchema = z.object({
    attribute: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .nullable(),
    value: z.array(
        z.object({
            tempId: z.string().optional(),
            value: z.string(),
        })
    ),
});

export const createSelectAttributeValueSchema = z.object({
    first: createLevelAttributeValueSchema.optional(),
    sec: createLevelAttributeValueSchema.optional(),
});

export const createProductTypeDetailSchema = z.object({
    value: createProductTypeAttributeValueSchema,
});

export const createProductTypeSchema = z.object({
    types: z.array(createProductTypeDetailSchema),
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

export const createProductTypesSchema = z.object({
    selectAttribute: createSelectAttributeValueSchema,
    types: z.array(createProductTypeSchema),
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

export const createProductDetailSchema = z.object({
    key: z.string().min(1, { message: ZOD_MESSAGE.require("Tên mô tả") }),
    value: z
        .string()
        .min(1, { message: ZOD_MESSAGE.require("Giá trị của mô tả") }),
});

export const createProductSchema = z.object({
    base: createProductBaseSchema,
    details: z.array(createProductDetailSchema),
    types: createProductTypesSchema,
});

/** @UPDATE */
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

export const updateProductTypeAttributeValueSchema = z.object({
    attrValueTempId: z.string().optional(),
    attrValueId: z.string().optional(),
    level: z.coerce
        .number({ message: ZOD_MESSAGE.number("Cấp thuộc tính") })
        .int({ message: ZOD_MESSAGE.int("Cấp thuộc tính") })
        .gt(0, { message: ZOD_MESSAGE.positive("Cấp thuộc tính") }),
});

export const updateProductTypeDetailSchema = z.object({
    value: updateProductTypeAttributeValueSchema,
});

export const updateProductTypeSchema = z.object({
    types: z.array(updateProductTypeDetailSchema),
    productTypeId: z.string().optional(),
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

export const updateLevelAttributeValueSchema = z.object({
    attribute: z
        .object({
            id: z.string(),
            name: z.string(),
        })
        .nullable(),
    value: z.array(
        z.object({
            id: z.string().optional(),
            tempId: z.string().optional(),
            value: z.string(),
        })
    ),
});

export const updateSelectAttributeValueSchema = z.object({
    first: updateLevelAttributeValueSchema.optional(),
    sec: updateLevelAttributeValueSchema.optional(),
});

export const updateProductTypesSchema = z.object({
    selectAttribute: updateSelectAttributeValueSchema,
    types: z.array(updateProductTypeSchema),
});

export const updateProductSchema = z
    .object({
        productId: z.string(),
        base: updateProductBaseSchema,
        details: z.array(updateProductDetailSchema),
        types: updateProductTypesSchema,
    })
    .superRefine(({ types, base }, ctx: z.RefinementCtx) => {
        const { sku } = base;
        const { types: typeAttrs } = types;

        const mapSku: Record<string, number> = {};
        if (sku) {
            mapSku[sku] = 1;
        }

        typeAttrs.forEach((t) => {
            if (t.sku) {
                mapSku[t.sku] = (mapSku[t.sku] || 0) + 1;
            }
        });

        if (Object.entries(mapSku).some(([sku, count]) => count > 1)) {
            ctx.addIssue({
                message:
                    "Các loại sản phẩm phải có mã SKU khác với sản phẩm gốc, hoặc khác nhau giữa các loại.",
                path: ["types"],
                code: "unrecognized_keys",
                keys: [],
            });
        }
    });
