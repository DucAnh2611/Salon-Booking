import { EServiceEmployeeExperience } from "@/enum/shift-employee.enum";

export const SERVICE_EMPLOYEE_EXP: Record<EServiceEmployeeExperience, string> =
    {
        [EServiceEmployeeExperience.BEGINNER]: "Mới làm",
        [EServiceEmployeeExperience.INTERMEDIATE]: "Trung bình",
        [EServiceEmployeeExperience.ADVANCED]: "Nâng cao",
    };
