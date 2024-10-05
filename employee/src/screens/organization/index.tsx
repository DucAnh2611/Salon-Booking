import OrganizationDataTable from "@/components/data-table/table/organization";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import useDebounce from "@/hooks/useDebounce";
import { organizationList } from "@/lib/redux/actions/organization.action";
import { organizationSelector } from "@/lib/redux/selector";
import { useAppDispatch } from "@/lib/redux/store";
import { PlusIcon, RefreshCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function OrganizationScreen() {
    const organizationState = useSelector(organizationSelector);
    const dispatch = useAppDispatch();

    const [limit, SetLimit] = useState<number>(organizationState.limit);
    const [page, SetPage] = useDebounce<number>(organizationState.page, 500);

    const handlePageUpdate = (page: number) => {
        if (page < 1) {
            SetPage(1);
        }
        const maxPage = Math.ceil(
            organizationState.count / organizationState.limit
        );
        if (page <= maxPage) {
            SetPage(page);
        }
    };

    const handleReload = () => {
        dispatch(organizationList({ page, limit }));
    };

    useEffect(() => {
        handleReload();
    }, [page, limit]);

    useEffect(() => {
        const { reload } = organizationState;

        if (reload) {
            handleReload();
        }
    }, [organizationState.reload]);

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="w-full h-full flex justify-between gap-4">
                    <div></div>
                    <div className="w-fit flex gap-2">
                        <Button
                            onClick={handleReload}
                            variant="outline"
                            className="gap-1"
                            disabled={organizationState.isCalling}
                        >
                            <RefreshCwIcon
                                size={14}
                                className={`${
                                    organizationState.isCalling
                                        ? "animate-spin"
                                        : ""
                                }`}
                            />
                            <p className="font-normal">
                                {organizationState.isCalling
                                    ? "Đang tải"
                                    : "Tải lại"}
                            </p>
                        </Button>

                        <Button className="gap-1" asChild>
                            <a href={"organization/add"}>
                                <PlusIcon size={14} />
                                <p className="font-normal">Tạo mới</p>
                            </a>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <OrganizationDataTable
                    count={organizationState.count}
                    items={organizationState.items}
                    page={organizationState.page}
                    limit={organizationState.limit}
                    handlePageUpdate={handlePageUpdate}
                />
            </CardContent>
        </Card>
    );
}

export default OrganizationScreen;
