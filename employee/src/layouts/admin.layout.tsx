import NavigationBar from "@/components/nav";
import NavigationPage from "@/components/pane";
import withAuth from "@/hoc/withAuth.hoc";
import { Outlet } from "react-router-dom";

function AdminLayout() {
    return (
        <div className="w-full h-full flex items-center">
            <div className="w-[350px] h-full">
                <NavigationPage />
            </div>
            <div className="flex-1 h-full overflow-hidden overflow-y-auto box-border p-4 flex flex-col gap-7">
                <div>
                    <NavigationBar />
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default withAuth(AdminLayout);
