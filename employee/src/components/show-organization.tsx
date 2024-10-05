import useDebounce from "@/hooks/useDebounce";
import { IOrganization } from "@/interface/api/organization.interface";
import { organizationSelectShow } from "@/lib/redux/actions/organization.action";
import { organizationSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useEffect, useState } from "react";
import { Switch } from "./ui/switch";
import { toast } from "./ui/use-toast";

interface ISelectShowOrganizationProps {
    organization: IOrganization;
}

export default function SelectShowOrganization({
    organization,
}: ISelectShowOrganizationProps) {
    const dispatch = useAppDispatch();
    const { isUpdating, isFailure } = useAppSelector(organizationSelector);
    const [canUpdate, SetCanUpdate] = useState<boolean>(false);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [showV, SetShowV] = useState<boolean>(organization.isShow);
    const [show, SetShow] = useDebounce<boolean>(organization.isShow);

    const handleChangeToggle = (check: boolean) => {
        SetShow(check);
        SetShowV(check);
        SetCanUpdate(true);
    };

    useEffect(() => {
        if (!isFailure && !isUpdating && submit) {
            toast({
                title: "Thành công",
                description: "Cập nhật trạng thái hiển thị thành công",
                duration: 1000,
            });
        }
    }, [isUpdating, isFailure, submit]);

    useEffect(() => {
        if (canUpdate) {
            SetSubmit(true);
            dispatch(organizationSelectShow(organization.id, show));
        }
    }, [show]);

    useEffect(() => {
        SetShowV(organization.isShow);
        SetShow(organization.isShow);
    }, [organization]);

    useEffect(() => {
        if (canUpdate && !isUpdating && !isFailure) {
            SetCanUpdate(false);
        }
    }, [isUpdating, isFailure]);

    return (
        <div>
            <Switch checked={showV} onCheckedChange={handleChangeToggle} />
        </div>
    );
}
