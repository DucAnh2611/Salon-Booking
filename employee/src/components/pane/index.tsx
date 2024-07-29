import { listNavigate } from "@/constants/navigation.constant";
import { ROUTER_PATH } from "@/constants/router.constant";
import { Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import SelectThemeDowndown from "../dropdown/select-theme";
import ItemNavigatePrimary from "../item-pane";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

export default function NavigationPage() {
    return (
        <Card className="w-full h-full rounded-none flex flex-col">
            <CardHeader className="h-fit p-4">
                <Button
                    variant="ghost"
                    className="text-lg font-medium gap-2 justify-start p-2 h-[50px] hover:bg-transparent"
                    size="lg"
                    asChild
                >
                    <Link to={ROUTER_PATH.HOME}>
                        <Calendar size={18} />
                        Salon Booking Management
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="flex-1 w-full flex flex-col p-4 pt-0">
                <div className="flex-1 flex flex-col overflow-hidden overflow-y-auto gap-2 ">
                    {listNavigate.map((item) => (
                        <div key={Math.random() * new Date().getTime()}>
                            <ItemNavigatePrimary item={item} />
                        </div>
                    ))}
                </div>
                <CardFooter className="p-0 w-full justify-end flex gap-2">
                    <SelectThemeDowndown />
                </CardFooter>
            </CardContent>
        </Card>
    );
}
