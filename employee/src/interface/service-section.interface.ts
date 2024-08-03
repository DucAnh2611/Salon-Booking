import {
    createServiceSchema,
    updateServiceSchema,
} from "@/schemas/service.schemas";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

export interface IServiceCreateSectionProps {
    form: UseFormReturn<z.infer<typeof createServiceSchema>>;
    sessionId: string;
}

export interface IServiceUpdateSectionProps {
    form: UseFormReturn<z.infer<typeof updateServiceSchema>>;
    sessionId: string;
}
