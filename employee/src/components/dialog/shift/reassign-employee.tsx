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

interface IDialogReassignEmployeeShiftProps {
    SetOpen: () => void;
    employee: IEmployee | null;
    onRemove: (employee: IEmployee) => void;
}

export default function DialogReassignEmployeeShift({
    SetOpen,
    employee,
    onRemove,
}: IDialogReassignEmployeeShiftProps) {
    return (
        <Dialog open={!!employee} onOpenChange={SetOpen}>
            {employee && (
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Loại bỏ {employee?.userBase.lastname}{" "}
                            {employee?.userBase.firstname} khỏi ca?
                        </DialogTitle>
                        <DialogDescription>
                            Loại bỏ nhân viên này sẽ khiến khách hàng không thể
                            chọn nhân viên trong ca làm việc hiện tại.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={SetOpen}>
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => onRemove(employee)}
                        >
                            Loại bỏ {employee?.userBase.lastname}{" "}
                            {employee?.userBase.firstname}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            )}
        </Dialog>
    );
}
