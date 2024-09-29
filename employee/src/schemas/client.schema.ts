import { z } from "zod";

export const clientUpdateStateSchema = z.object({
    clientId: z.string(),
    lockAccount: z.boolean().optional(),
    lockOrder: z.boolean().optional(),
});
