import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { API_URLS } from "@/constants/api.constant";
import useDebounce from "@/hooks/useDebounce";
import { IFindRole, IRole } from "@/interface/api/role.interface";
import { apiCall } from "@/utils/apiCall";
import { PopoverTrigger } from "@radix-ui/react-popover";
import { CheckIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface IPopoverSelectParentProps {
    onSelectParent: (item: IRole | null) => void;
    selected: IRole | null;
    disabled?: boolean;
}

export default function PopoverSelectParentRole({
    onSelectParent,
    selected,
    disabled = false,
}: IPopoverSelectParentProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const [items, SetItems] = useState<IRole[]>([]);
    const [key, SetKey] = useDebounce<string>("", 500);
    const [limit, SetLimit] = useState<number>(10);
    const [page, SetPage] = useDebounce<number>(1, 500);
    const [count, SetCount] = useState<number>(0);
    const [select, SetSelect] = useState<IRole | null>(selected);
    const [canScroll, SetCanScroll] = useState<boolean>(true);
    const [isNewList, SetIsNewList] = useState<boolean>(false);

    const fetchList = async () => {
        const api = API_URLS.ROLE.LIST(page, limit, key);
        const { response } = await apiCall<IFindRole>({ ...api });

        if (response) {
            if (response.result.items.length + items.length <= page * limit) {
                SetItems(
                    isNewList
                        ? response.result.items
                        : [...items, ...response.result.items]
                );
                SetCount(response.result.count);
            }

            const maxPage = Math.ceil(response.result.count / limit);
            if (page >= maxPage) {
                SetCanScroll(false);
            } else if (!canScroll) {
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
        SetCount(0);
    };

    const handleChangeKey = (e: ChangeEvent<HTMLInputElement>) => {
        SetKey(e.target.value);
        if (!isNewList) {
            SetIsNewList(true);
        }
    };

    const handleSelect = (item: IRole | null) => () => {
        onSelectParent(item);
        SetSelect(item);
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
        SetSelect(selected);
    }, [selected]);

    return (
        <Popover>
            <PopoverTrigger className="w-full" disabled={disabled}>
                <Button
                    disabled={disabled}
                    className="w-full justify-start font-normal"
                    variant="outline"
                    type="button"
                    onClick={reset}
                >
                    {select ? select.title : "Chọn chức vụ cha"}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="start"
                className="w-[350px] flex flex-col gap-2"
            >
                <div className="w-full flex gap-2">
                    <Input
                        placeholder="Nhập tên chức vụ"
                        onChange={handleChangeKey}
                    />
                    {select && (
                        <Button
                            variant="destructive"
                            className="gap-1"
                            onClick={handleSelect(null)}
                        >
                            Xóa
                        </Button>
                    )}
                </div>
                <ScrollArea
                    ref={scrollRef}
                    onScroll={handleScroll}
                    type="always"
                    className="h-fit w-full"
                >
                    <div className="w-full flex flex-col gap-1 max-h-[200px]">
                        {items.length ? (
                            items.map((item) => (
                                <Button
                                    key={item.id}
                                    variant={
                                        select && select.id === item.id
                                            ? "default"
                                            : "ghost"
                                    }
                                    onClick={handleSelect(
                                        select && item.id === select.id
                                            ? null
                                            : item
                                    )}
                                    className={`justify-between px-2`}
                                >
                                    <div className="flex items-center justify-start gap-2">
                                        <p>{item.title}</p>
                                    </div>
                                    <div>
                                        {select && select.id === item.id && (
                                            <CheckIcon size={16} />
                                        )}
                                    </div>
                                </Button>
                            ))
                        ) : (
                            <div className="w-full h-[50px] flex justify-center items-center">
                                <p className="text-sm">Không có chức vụ nào</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
}
