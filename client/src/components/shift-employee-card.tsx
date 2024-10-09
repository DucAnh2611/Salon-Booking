import { SERVICE_EMPLOYEE_EXP } from "@/constant/service-employee.constant";
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
                "w-full h-full overflow-hidden group",
                isSelect && "border-primary"
            )}
        >
            <div className="w-full h-[150px] overflow-hidden">
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
