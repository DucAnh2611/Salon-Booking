import { EShiftEmployeeStatus } from "@/enum/shift.enum";

export const EMPLOYEE_SHIFT_STATUS_TEXT: Record<EShiftEmployeeStatus, string> =
    {
        [EShiftEmployeeStatus.AVAILABLE]: "Sẵn sàng",
        [EShiftEmployeeStatus.BOOKED]: "Đã đặt",
        [EShiftEmployeeStatus.ON_JOB]: "Đang làm",
        [EShiftEmployeeStatus.URGENT_LEAVE]: "Nghỉ đột xuất",
    };
