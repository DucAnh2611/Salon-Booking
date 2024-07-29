import { THEME_TEXT } from "@/constants/theme.constant";
import { ETheme } from "@/enum/theme.enum";
import { themeSwitchApi } from "@/lib/redux/actions/theme.action";
import { themeSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { CheckIcon, MoonIcon, SunIcon } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export default function SelectThemeDowndown() {
    const dispatch = useAppDispatch();
    const { theme } = useAppSelector(themeSelector);

    const detectTheme = () => {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? ETheme.DARK
            : ETheme.LIGHT;
        dispatch(themeSwitchApi(systemTheme));
    };

    const handleSelect = (gender: ETheme) => () => {
        dispatch(themeSwitchApi(gender));
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("salon_booking_admin_theme");
        if (savedTheme) {
            dispatch(themeSwitchApi((savedTheme as ETheme) || ETheme.LIGHT));
        } else {
            detectTheme();
        }
    }, []);

    useEffect(() => {
        if (theme) {
            document.body.className = theme;
        }
    }, [theme]);

    if (!theme) return <></>;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    {theme === ETheme.LIGHT ? (
                        <SunIcon size={15} />
                    ) : (
                        <MoonIcon size={15} />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="end" className="w-auto">
                {Object.entries(ETheme).map(([field, value]) => (
                    <DropdownMenuItem key={field} asChild>
                        <Button
                            onClick={handleSelect(value)}
                            className="w-full justify-between gap-1 cursor-pointer"
                            variant={theme === value ? "default" : "ghost"}
                        >
                            <span>{THEME_TEXT[value]}</span>
                            {theme === value && <CheckIcon size={15} />}
                        </Button>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
