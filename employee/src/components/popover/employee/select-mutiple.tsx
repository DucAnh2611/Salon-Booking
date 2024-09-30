import MediaLoader from "@/components/media-load";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { API_URLS } from "@/constants/api.constant";
import useDebounce from "@/hooks/useDebounce";
import { IEmployee, IFindEmployee } from "@/interface/api/employee.interface";
import { apiCall } from "@/utils/apiCall";
import { CheckIcon, PlusIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface IPopoverSelectMutipleEmployee {
    selects: IEmployee[];
    onSelect: (employee: IEmployee) => void;
}

export default function PopoverSelectMutipleEmployee({
    selects,
    onSelect,
}: IPopoverSelectMutipleEmployee) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const [items, SetItems] = useState<IEmployee[]>([]);
    const [key, SetKey] = useDebounce<string>("");
    const [limit] = useState<number>(10);
    const [page, SetPage] = useDebounce<number>(1);
    const [count, SetCount] = useState<number>(0);
    const [select, SetSelect] = useState<IEmployee[]>([]);
    const [canScroll, SetCanScroll] = useState<boolean>(true);
    const [isNewList, SetIsNewList] = useState<boolean>(false);

    const fetchList = async () => {
        const api = API_URLS.EMPLOYEE.LIST(page, limit, key, "");
        const { response } = await apiCall<IFindEmployee>({ ...api });

        if (response) {
            if (
                response.result.items.length + items.length <= page * limit &&
                !isNewList
            ) {
                SetItems([...items, ...response.result.items]);
            } else {
                SetItems(response.result.items);
            }
            SetCount(response.result.count);

            const maxPage = Math.ceil(response.result.count / limit);
            if (page >= maxPage) {
                SetCanScroll(false);
            } else {
                SetCanScroll(true);
            }
            SetIsNewList(false);
        } else {
            SetCanScroll(false);
        }
        return;
    };

    const reset = () => {
        SetKey("");
        SetPage(1);
    };

    const handleChangeKey = (e: ChangeEvent<HTMLInputElement>) => {
        SetKey(e.target.value);
        SetIsNewList(true);
        SetPage(1);
    };

    const handleSelect = (item: IEmployee) => () => {
        const newSelect = select.some((e) => e.id === item.id)
            ? select.filter((e) => e.id !== item.id)
            : [...select, item];

        onSelect(item);
        SetSelect(newSelect);
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollTop + clientHeight >= scrollHeight && canScroll) {
                SetPage(page + 1);
            }
        }
    };
    useEffect(() => {
        fetchList();
    }, [key, page, limit]);

    useEffect(() => {
        SetSelect(selects);
    }, [selects]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"secondary"} className="gap-1" type="button">
                    <PlusIcon size={15} /> Thêm nhân viên
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="start"
                className="w-[350px] flex flex-col gap-2"
            >
                <div>
                    <div>
                        <div className="w-full flex gap-2">
                            <Input
                                placeholder="Nhập tên"
                                onChange={handleChangeKey}
                            />
                        </div>
                    </div>
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="w-full flex flex-col gap-1 max-h-[200px] overflow-y-auto mt-2"
                    >
                        {items.length ? (
                            items.map((item) => (
                                <Button
                                    key={item.id}
                                    variant={
                                        select.some((s) => s.id === item.id)
                                            ? "default"
                                            : "ghost"
                                    }
                                    onClick={handleSelect(item)}
                                    className={`justify-between px-2 py-2 h-fit`}
                                >
                                    <div className="flex items-center justify-start gap-2">
                                        <div className="size-10 rounded-full overflow-hidden">
                                            <MediaLoader
                                                media={item.userBase.userAvatar}
                                            />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p>{item.username}</p>
                                            <p className="text-xs">
                                                {item.userBase.lastname}{" "}
                                                {item.userBase.firstname}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        {select.some(
                                            (s) => s.id === item.id
                                        ) && <CheckIcon size={16} />}
                                    </div>
                                </Button>
                            ))
                        ) : (
                            <div className="w-full h-[50px] flex justify-center items-center">
                                <p className="text-sm">
                                    Không có nhân viên nào
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
