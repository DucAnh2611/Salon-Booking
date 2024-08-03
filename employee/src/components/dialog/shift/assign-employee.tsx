import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
} from "@/components/ui/dialog";
import { IEmployee } from "@/interface/api/employee.interface";
import { DialogTitle } from "@radix-ui/react-dialog";

interface IDialogAssignEmployeeShiftProps {
    SetOpen: () => void;
    employee: IEmployee | null;
    onAdd: (employee: IEmployee) => void;
}

export default function DialogAssignEmployeeShift({
    SetOpen,
    employee,
    onAdd,
}: IDialogAssignEmployeeShiftProps) {
    return (
        <Dialog open={!!employee} onOpenChange={SetOpen}>
            {employee && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Thêm {employee?.userBase.lastname}{" "}
                            {employee?.userBase.firstname} vào ca?
                        </DialogTitle>
                        <DialogDescription>
                            Thêm nhân viên sẽ giúp khách hàng chọn được nhân
                            viên vào ca làm việc hiện tại.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={SetOpen}>
                            Hủy
                        </Button>
                        <Button
                            variant="default"
                            onClick={() => onAdd(employee)}
                        >
                            Thêm {employee?.userBase.lastname}{" "}
                            {employee?.userBase.firstname}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}
