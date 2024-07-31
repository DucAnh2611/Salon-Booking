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
    IMediaServiceUpdateTempUrl,
    IMediaTempUpload,
} from "@/interface/api/media.interface";
import { IServiceBaseDetail } from "@/interface/api/service.interface";
import { IServiceUpdateSectionProps } from "@/interface/service-section.interface";
import { cn } from "@/lib";
import { updateServiceMediaSchema } from "@/schemas/service.schemas";
import { api_media_url } from "@/utils/apiCall";
import { getMediaType } from "@/utils/media-checker.util";
import { generateUUID } from "@/utils/uuid.utils";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

interface IUpdateServiceBaseSectionProps extends IServiceUpdateSectionProps {
    base: IServiceBaseDetail;
}

export default function UpdateServiceBaseSection({
    form,
    sessionId,
    base,
}: IUpdateServiceBaseSectionProps) {
    const [selectCategory, SetSelectCategory] = useState<ICategory | null>(
        null
    );

    const [medias, SetMedias] = useState<IMediaServiceUpdateTempUrl[]>([]);

    const defineThumbnail = (list: IMediaServiceUpdateTempUrl[]) => {
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
        const newMedias: IMediaServiceUpdateTempUrl[] = [
            ...medias,
            ...temp.map((t) => ({
                url: t.url,
                isThumbnail: false,
                tempId: generateUUID(),
            })),
        ];
        SetMedias(defineThumbnail(newMedias));
    };

    const onToggleThumbnailUrl = (media: IMediaServiceUpdateTempUrl) => () => {
        const newProductMedia = defineThumbnail(
            medias.map((m) => {
                if (media.id && m.id === media.id) {
                    return {
                        ...m,
                        isThumbnail: !m.isThumbnail,
                    };
                }
                if (media.tempId && m.tempId === media.tempId) {
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

    const onRemoveMedia = (media: IMediaServiceUpdateTempUrl) => () => {
        const newProductMedia = defineThumbnail(
            medias.filter((m) => {
                if (media.id) {
                    return m.id !== media.id || m.tempId;
                }
                if (media.tempId) {
                    return m.tempId !== media.tempId || m.id;
                }
                return false;
            })
        );

        SetMedias(newProductMedia);
    };

    useEffect(() => {
        form.setValue(
            "base.medias",
            medias.map((media) => {
                const mapMedia: z.infer<typeof updateServiceMediaSchema> = {
                    isThumbnail: media.isThumbnail,
                };

                if (media.id) {
                    mapMedia.mediaId = media.id;
                } else if (media.tempId) {
                    mapMedia.mediaUrl = media.url;
                }

                return mapMedia;
            })
        );
    }, [medias]);

    useEffect(() => {
        SetSelectCategory(base.category);
        SetMedias(
            base.media.map((media) => ({
                id: media.mediaId,
                url: media.media.path,
                isThumbnail: media.isThumbnail,
            }))
        );
    }, [base]);

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
                                                <div className="flex gap-1 cursor-default ">
                                                    <Input
                                                        type="number"
                                                        placeholder="Thời lượng"
                                                        {...field}
                                                    />
                                                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                        <p>Phút</p>
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
                                                            media
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
                                                            media
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
