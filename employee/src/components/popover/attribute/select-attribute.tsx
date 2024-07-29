import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { API_URLS } from "@/constants/api.constant";
import useDebounce from "@/hooks/useDebounce";
import {
    IAttribute,
    IFindAttribute,
} from "@/interface/api/attribute.interface";
import { apiCall } from "@/utils/apiCall";
import { CheckIcon } from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface IPopoverSelectAttributeProduct {
    onSelect: (attrId: IAttribute | null) => void;
    selected: IAttribute | null;
}

export default function PopoverSelectAttributeProduct({
    onSelect,
    selected,
}: IPopoverSelectAttributeProduct) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const [items, SetItems] = useState<IAttribute[]>([]);
    const [key, SetKey] = useDebounce<string>("");
    const [limit, SetLimit] = useState<number>(10);
    const [page, SetPage] = useDebounce<number>(1);
    const [count, SetCount] = useState<number>(0);
    const [select, SetSelect] = useState<IAttribute | null>(selected);
    const [canScroll, SetCanScroll] = useState<boolean>(true);
    const [isNewList, SetIsNewList] = useState<boolean>(false);
    const [newAttribute, SetNewAttribute] = useState<string>("");
    const [openCreate, SetOpenCreate] = useState<boolean>(false);

    const fetchList = async () => {
        const api = API_URLS.ATTRIBUTE.LIST(page, limit, key, "");
        const { response } = await apiCall<IFindAttribute>({ ...api });

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

    const handleSelect = (item: IAttribute | null) => () => {
        onSelect(item);
        SetSelect(item);
    };

    const handleChangeNew = (e: ChangeEvent<HTMLInputElement>) => {
        SetNewAttribute(e.target.value);
    };

    const handleScroll = () => {
        if (scrollRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
            if (scrollTop + clientHeight >= scrollHeight && canScroll) {
                console.log(123123);
                SetPage(page + 1);
            }
        }
    };

    const toggleOpenCreate = async () => {
        SetOpenCreate(!openCreate);
    };

    const handleCreate = async () => {
        const api = API_URLS.ATTRIBUTE.CREATE();
        const payload = {
            name: newAttribute,
        };
        const { response } = await apiCall({ ...api, payload });

        if (response) {
            reset();

            SetItems([]);
            SetNewAttribute("");
            SetOpenCreate(!openCreate);
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
            <PopoverTrigger className="w-full flex flex-col justify-start gap-2">
                <Button
                    id="parent"
                    type="button"
                    className="w-full justify-start font-normal"
                    variant="outline"
                    onClick={reset}
                >
                    {select ? select.name : "Chọn kiểu"}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                side="bottom"
                align="start"
                className="w-[350px] flex flex-col gap-2"
            >
                <div>
                    {openCreate ? (
                        <div className="w-full flex gap-2">
                            <Input
                                placeholder="Nhập tên kiểu mới"
                                onChange={handleChangeNew}
                                value={newAttribute}
                            />
                            {newAttribute.length ? (
                                <Button
                                    className="gap-1"
                                    onClick={handleCreate}
                                >
                                    Tạo
                                </Button>
                            ) : (
                                <Button
                                    variant="destructive"
                                    className="gap-1"
                                    onClick={toggleOpenCreate}
                                >
                                    Hủy
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="w-full flex gap-2">
                            <Input
                                placeholder="Nhập tên kiểu"
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
                            <Button
                                className="gap-1"
                                onClick={toggleOpenCreate}
                            >
                                Tạo mới
                            </Button>
                        </div>
                    )}
                </div>
                <div>
                    <div
                        ref={scrollRef}
                        onScroll={handleScroll}
                        className="w-full flex flex-col gap-1 max-h-[200px] overflow-y-auto"
                    >
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
                                        <p>{item.name}</p>
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
                                <p className="text-sm">Không có kiểu nào</p>
                            </div>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
