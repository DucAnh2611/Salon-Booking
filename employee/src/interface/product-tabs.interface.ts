import {
    createProductSchema,
    updateProductSchema,
} from "@/schemas/product.schema";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export interface IProductTabCreateProps {
    form: UseFormReturn<z.infer<typeof createProductSchema>>;
    sessionId: string;
}

export interface IProductTabUpdateProps {
    form: UseFormReturn<z.infer<typeof updateProductSchema>>;
    sessionId: string;
}
