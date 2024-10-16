import { SERVICE_EMPLOYEE_EXP } from "@/constant/service-employee.constant";
import { EMPLOYEE_SHIFT_STATUS_TEXT } from "@/constant/shift.constant";
import { IEmployeeShift } from "@/interface/employee.interface";
import { api_media_url } from "@/lib/apiCall";
import { joinString } from "@/lib/string";
import { cn } from "@/lib/utils";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import { Card } from "./ui/card";

interface IShiftEmployeeCardProps {
    employee: IEmployeeShift;
    isSelect: boolean;
}

export default function ShiftEmployeeCard({
    isSelect = false,
    employee,
}: IShiftEmployeeCardProps) {
    return (
        <Card
            className={cn(
                "w-full h-full overflow-hidden group relative",
                isSelect && "border-primary"
            )}
        >
            {!employee.selectable && (
                <div className="absolute top-0 left-0 w-full h-full bg-muted-foreground opacity-50 z-[1]" />
            )}
            <div className="w-full h-[130px] overflow-hidden relative z-[0]">
                <div className="absolute top-2 right-2 rounded-md shadow-primary shadow-md bg-primary text-xs p-1 text-background font-medium px-2  ">
                    {EMPLOYEE_SHIFT_STATUS_TEXT[employee.status]}
                </div>
                {employee.employee.userBase.userAvatar ? (
                    <Image
                        alt="e_s"
                        src={joinString({
                            joinString: "",
                            strings: [
                                api_media_url,
                                employee.employee.userBase.userAvatar.path,
                            ],
                        })}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover duration-100 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ImageOff size={15} />{" "}
                    </div>
                )}
            </div>
            <div className="p-2">
                <p className="w-full line-clamp-1 whitespace-nowrap text-ellipsis text-sm font-medium">
                    {joinString({
                        joinString: " ",
                        strings: [
                            employee.employee.userBase.lastname,
                            employee.employee.userBase.firstname,
                        ],
                    })}
                </p>
                <p className="text-primary text-xs">
                    {joinString({
                        joinString: " ",
                        strings: [
                            "Trình độ: ",
                            SERVICE_EMPLOYEE_EXP[employee.experience],
                        ],
                    })}
                </p>
            </div>
        </Card>
    );
}
