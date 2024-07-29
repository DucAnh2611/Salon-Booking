import PermissionListTab from "@/components/tab/permisison";
import RoleListTab from "@/components/tab/role";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTER_PATH } from "@/constants/router.constant";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TabValues: Array<{
    value: string;
    content: string;
    Tab: any;
}> = [
    {
        value: "role",
        content: "Danh sách chức vụ",
        Tab: RoleListTab,
    },
    {
        value: "permission",
        content: "Danh sách quyền",
        Tab: PermissionListTab,
    },
];

function RoleScreen() {
    const location = useLocation();
    const navigate = useNavigate();

    const [value, SetValue] = useState<string>("");

    const handleClickTab = (value: string) => () => {
        navigate(`${ROUTER_PATH.ROLE}?tab=${value}`);
    };

    useEffect(() => {
        const search = new URLSearchParams(location.search);

        SetValue(search.get("tab") || TabValues[0].value);
    }, [location]);

    return (
        <Tabs
            defaultValue={TabValues[0].value}
            value={value}
            className="w-full h-full"
        >
            <TabsList>
                {TabValues.map((tab) => (
                    <TabsTrigger
                        key={tab.value}
                        value={tab.value}
                        onClick={handleClickTab(tab.value)}
                    >
                        {tab.content}
                    </TabsTrigger>
                ))}
            </TabsList>

            {TabValues.map(({ value, Tab }) => (
                <TabsContent key={value} value={value}>
                    <Tab />
                </TabsContent>
            ))}
        </Tabs>
    );
}

export default RoleScreen;
