import { EServiceEmployeeExperience } from "@/enum/service.enum";

export const SERVICE_EMPLOYEE_EXP_TEXT: Record<
    EServiceEmployeeExperience,
    string
> = {
    [EServiceEmployeeExperience.BEGINNER]: "Mới làm",
    [EServiceEmployeeExperience.INTERMEDIATE]: "Làm tốt",
    [EServiceEmployeeExperience.ADVANCED]: "Nâng cao",
};
