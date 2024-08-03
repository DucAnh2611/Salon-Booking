import { ROUTER_PATH } from "@/constants/router.constant";
import { IWorkingHour } from "@/interface/api/working-hour.interface";
import { Link, useNavigate } from "react-router-dom";
import DialogCreateSingleWorkingDay from "./dialog/working/create-single";
import DialogDeleteWorkingDay from "./dialog/working/delete";
import DialogToggleOffWorkingDay from "./dialog/working/off";
import DialogUpdateSingleWorkingDay from "./dialog/working/update-single";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "./ui/context-menu";
import WorkingDay from "./woking-day";

interface IWorkingDayContextProps {
    day: Date;
    isCurrentMonth: boolean;
    workingHour: IWorkingHour | null;
}

export default function WorkingDayContext({
    day,
    isCurrentMonth,
    workingHour,
}: IWorkingDayContextProps) {
    const navigate = useNavigate();

    const handleDetail = (id: string) => () => {
        navigate(`${ROUTER_PATH.WORKING}/${id}`);
    };

    return (
        <ContextMenu>
            <ContextMenuTrigger>
                <WorkingDay
                    day={day}
                    isCurrentMonth={isCurrentMonth}
                    workingHour={workingHour}
                />
            </ContextMenuTrigger>
            <ContextMenuContent>
                {workingHour ? (
                    <>
                        {workingHour.start &&
                            new Date(workingHour.start) > new Date() && (
                                <>
                                    <DialogUpdateSingleWorkingDay
                                        working={workingHour}
                                    />
                                    <ContextMenuItem asChild>
                                        <Link
                                            className="flex gap-2 items-center"
                                            to={`${ROUTER_PATH.WORKING}/u/${workingHour.id}`}
                                        >
                                            <p>Chỉnh sửa ca làm việc</p>
                                        </Link>
                                    </ContextMenuItem>{" "}
                                </>
                            )}
                        <ContextMenuItem onClick={handleDetail(workingHour.id)}>
                            <div className="flex gap-2 items-center">
                                <p>Chi tiết</p>
                            </div>
                        </ContextMenuItem>
                    </>
                ) : new Date(day) > new Date() ? (
                    <DialogCreateSingleWorkingDay day={day} />
                ) : (
                    <ContextMenuItem disabled>
                        <div className="flex gap-2 items-center font-semibold">
                            Không có chức năng nào
                        </div>
                    </ContextMenuItem>
                )}
                {workingHour &&
                workingHour.start &&
                new Date(workingHour.start) > new Date() ? (
                    <>
                        <ContextMenuSeparator />

                        <DialogToggleOffWorkingDay working={workingHour} />
                        <DialogDeleteWorkingDay working={workingHour} />
                    </>
                ) : (
                    <></>
                )}
            </ContextMenuContent>
        </ContextMenu>
    );
}
