import PopoverSelectCategory from "@/components/popover/category/select-category";
import RequireField from "@/components/require-field";
import SelectMedia from "@/components/select/select-media";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ICategory } from "@/interface/api/category.interface";
import {
    IMediaProductTempUrl,
    IMediaServiceTempUrl,
    IMediaTempUpload,
} from "@/interface/api/media.interface";
import { IServiceCreateSectionProps } from "@/interface/service-section.interface";
import { cn } from "@/lib";
import { api_media_url } from "@/utils/apiCall";
import { getMediaType } from "@/utils/media-checker.util";
import { generateUUID } from "@/utils/uuid.utils";
import { CheckIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

interface ICreateServiceBaseSection extends IServiceCreateSectionProps {}

export default function CreateServiceBaseSection({
    form,
    sessionId,
}: ICreateServiceBaseSection) {
    const [selectCategory, SetSelectCategory] = useState<ICategory | null>(
        null
    );
    const [duration, SetDuration] = useState<{
        hours: number;
        minutes: number;
    }>({ hours: 0, minutes: 0 });
    const [medias, SetMedias] = useState<IMediaServiceTempUrl[]>([]);

    const defineThumbnail = (list: IMediaProductTempUrl[]) => {
        if (list.every((i) => !i.isThumbnail)) {
            if (list.length) {
                list[0].isThumbnail = true;
            }
        }
        return list;
    };

    const onSelectCategory = (item: ICategory | null) => {
        if (item) {
            form.setValue("base.categoryId", item.id);
        }
        SetSelectCategory(item);
    };

    const onSelectProductMedia = (temp: IMediaTempUpload[]) => {
        const newMedias = [
            ...medias,
            ...temp.map((t) => ({
                id: generateUUID(),
                url: t.url,
                isThumbnail: false,
            })),
        ];
        SetMedias(defineThumbnail(newMedias));
    };

    const onToggleThumbnailUrl = (id: string) => () => {
        const newProductMedia = defineThumbnail(
            medias.map((m) => {
                if (m.id === id) {
                    return {
                        ...m,
                        isThumbnail: !m.isThumbnail,
                    };
                }
                return m;
            })
        );
        SetMedias(newProductMedia);
    };

    const onRemoveMedia = (id: string) => () => {
        const newProductMedia = defineThumbnail(
            medias.filter((m) => m.id !== id)
        );

        SetMedias(newProductMedia);
    };

    const handleChangeDuration =
        (type: "minutes" | "hours") => (e: ChangeEvent<HTMLInputElement>) => {
            const newDuration = {
                ...duration,
            };

            const value = parseInt(e.target.value) || 0;

            switch (type) {
                case "minutes":
                    if (value <= 0) {
                        newDuration.hours = 0;
                        newDuration.minutes = 0;
                        break;
                    }
                    if (value >= 60) {
                        const addHour = Math.floor(value / 60);

                        newDuration.hours += addHour;
                        newDuration.minutes = value % 60;
                        break;
                    }
                    newDuration.minutes = value;
                    break;
                case "hours":
                    if (value <= 0) {
                        newDuration.hours = 0;
                        break;
                    }
                    newDuration.hours = value;
                    break;
                default:
                    break;
            }

            form.setValue(
                "base.duration",
                newDuration.hours * 60 + newDuration.minutes
            );
            SetDuration(newDuration);
        };

    useEffect(() => {
        form.setValue(
            "base.medias",
            medias.map((media) => ({
                mediaUrl: media.url,
                isThumbnail: media.isThumbnail,
            }))
        );
    }, [medias]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thông tin cơ bản dịch vụ</CardTitle>
                <CardDescription>
                    Một số thông tin dịch vụ về tên dịch vụ, giá, thời gian của
                    dịch vụ, ...
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-5">
                        <div className="">
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="base.name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Tên dịch vụ <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Tên dịch vụ"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="base.categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Danh mục <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <div>
                                                    <PopoverSelectCategory
                                                        onSelect={
                                                            onSelectCategory
                                                        }
                                                        selected={
                                                            selectCategory
                                                        }
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="base.price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Giá <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex gap-1 cursor-default ">
                                                    <Input
                                                        className="flex-1"
                                                        placeholder="Giá"
                                                        type="number"
                                                        {...field}
                                                    />
                                                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                        <p>vnđ</p>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="base.duration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Thời lượng <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex gap-2 cursor-default">
                                                    {duration.hours > 0 && (
                                                        <div className="flex gap-1 flex-1">
                                                            <Input
                                                                type="number"
                                                                placeholder="Giờ"
                                                                value={
                                                                    duration.hours
                                                                }
                                                                onChange={handleChangeDuration(
                                                                    "hours"
                                                                )}
                                                            />
                                                            <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                                <p>Giờ</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="flex gap-1 flex-1">
                                                        <Input
                                                            type="number"
                                                            placeholder="Phút"
                                                            value={
                                                                duration.minutes
                                                            }
                                                            onChange={handleChangeDuration(
                                                                "minutes"
                                                            )}
                                                        />
                                                        <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                            <p>Phút</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="col-span-2">
                                    <FormField
                                        control={form.control}
                                        name="base.description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Mô tả
                                                    <RequireField />
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Mô tả"
                                                        className="resize-none h-[200px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-2">
                            <div>
                                <FormLabel className="leading-none text-sm">
                                    Ảnh, video dịch vụ <RequireField />
                                </FormLabel>
                                <SelectMedia
                                    onSelect={onSelectProductMedia}
                                    sessionId={sessionId}
                                />
                            </div>
                            {medias && medias.length ? (
                                <div className="grid-cols-4 grid gap-2">
                                    {medias.map((media) => (
                                        <div
                                            className="w-full aspect-square rounded-md overflow-hidden relative group/preview"
                                            key={media.url}
                                        >
                                            <div
                                                className={cn(
                                                    "group-hover/preview:flex flex absolute w-full h-full top-0 left-0 bg-transparent items-start justify-end rounded-md z-[1]",
                                                    media.isThumbnail
                                                        ? "border border-primary"
                                                        : ""
                                                )}
                                            >
                                                {media.isThumbnail && (
                                                    <p className="w-fit h-fit bg-primary text-black px-3 text-xs rounded-bl-md absolute right-0 top-0">
                                                        Bìa
                                                    </p>
                                                )}
                                                <div className=" w-full h-full group-hover/preview:flex flex-col hidden items-center bg-black bg-opacity-10 justify-center gap-2">
                                                    <Button
                                                        type="button"
                                                        variant={
                                                            media.isThumbnail
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                        className="gap-1 w-[70%]"
                                                        size="sm"
                                                        onClick={onToggleThumbnailUrl(
                                                            media.id
                                                        )}
                                                    >
                                                        {media.isThumbnail ? (
                                                            <>
                                                                <CheckIcon
                                                                    size={15}
                                                                />
                                                                Bỏ chọn làm bìa
                                                            </>
                                                        ) : (
                                                            <>Chọn làm bìa</>
                                                        )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        className="gap-1 w-[70%]"
                                                        size="sm"
                                                        onClick={onRemoveMedia(
                                                            media.id
                                                        )}
                                                    >
                                                        Xóa
                                                    </Button>
                                                </div>
                                            </div>

                                            {getMediaType(media.url) ===
                                            "image" ? (
                                                <>
                                                    <img
                                                        src={
                                                            api_media_url +
                                                            media.url
                                                        }
                                                        alt="product-temp"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </>
                                            ) : (
                                                <video
                                                    src={
                                                        api_media_url +
                                                        media.url
                                                    }
                                                    controls
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full p-10 border rounded border-dashed">
                                    <p className="w-full text-xs text-center">
                                        Không có ảnh, video nào
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
