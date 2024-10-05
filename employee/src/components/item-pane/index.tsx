import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

export interface IItemNavigate {
    Icon?: any;
    title: string;
    children?: IItemNavigate[];
    path?: string;
}

export type TItemNavigateProps = {
    item: IItemNavigate;
    level?: number;
};

export default function ItemNavigate({ item, level = 1 }: TItemNavigateProps) {
    const { Icon } = item;

    const location = useLocation();
    const navigate = useNavigate();

    const [isActive, SetIsActive] = useState<boolean>(false);
    const [open, SetOpen] = useState<boolean>(true);

    const handleClick = () => {
        if (item.children) {
            handleClickOpen();
        }
        if (item.path) {
            document.title = item.title;
            navigate(item.path);
        }
    };

    const handleClickOpen = () => {
        SetOpen(!open);
    };

    useEffect(() => {
        if (
            item.path &&
            location.pathname === item.path &&
            location.pathname !== "/"
        ) {
            document.title = item.title;
            SetIsActive(true);
        } else {
            SetIsActive(false);
        }
    }, [location.pathname]);

    return (
        <div className="w-full h-fit flex flex-col gap-2 items-end">
            <div className="w-full h-fit relative group/nav">
                <Button
                    onClick={handleClick}
                    variant={isActive ? "default" : "ghost"}
                    className="w-full h-fit justify-start gap-1 relative z-0 box-border"
                >
                    {Icon && (
                        <div className="w-[20px] h-fit">
                            <Icon size={15} />
                        </div>
                    )}
                    {item.path ? (
                        <Link
                            to={item.path}
                            className={`${
                                level === 1 ? "font-semibold" : "font-normal"
                            }`}
                        >
                            {item.title}
                        </Link>
                    ) : (
                        <p
                            className={`${
                                level === 1 ? "font-semibold" : "font-normal"
                            }`}
                        >
                            {item.title}
                        </p>
                    )}
                </Button>
                {item.children && (
                    <Button
                        className="w-fit h-fit absolute right-0 top-1/2 -translate-y-1/2 group-hover/nav:bg-transparent z-[1]"
                        variant="ghost"
                        onClick={handleClickOpen}
                    >
                        {!open ? (
                            <ChevronDownIcon size={15} />
                        ) : (
                            <ChevronUpIcon size={15} />
                        )}
                    </Button>
                )}
            </div>
            {open && item.children && (
                <div className="w-[90%] flex flex-col pb-2">
                    {item.children &&
                        item.children.map((child) => (
                            <div key={Math.random() * new Date().getTime()}>
                                <ItemNavigate item={child} level={level + 1} />
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
