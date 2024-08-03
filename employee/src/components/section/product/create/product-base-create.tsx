import { ICategory } from "@/interface/api/category.interface";
import {
    IMediaProductTempUrl,
    IMediaTempUpload,
} from "@/interface/api/media.interface";
import { IProductTabCreateProps } from "@/interface/product-tabs.interface";
import { cn } from "@/lib";
import { api_media_url } from "@/utils/apiCall";
import { getMediaType } from "@/utils/media-checker.util";
import { generateUUID } from "@/utils/uuid.utils";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import PopoverSelectCategory from "../../../popover/category/select-category";
import RequireField from "../../../require-field";
import SelectMedia from "../../../select/select-media";
import { Button } from "../../../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../../ui/card";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../../ui/form";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";

export default function CreateProductBaseSection({
    form,
    sessionId,
}: IProductTabCreateProps) {
    const [selectCategory, SetSelectCategory] = useState<ICategory | null>(
        null
    );

    const [productMedia, SetProductMedia] = useState<IMediaProductTempUrl[]>(
        form
            .getValues("base.thumbnailUrls")
            ?.map((item) => ({ ...item, id: generateUUID() })) || []
    );

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
        const newProductMedia = [
            ...productMedia,
            ...temp.map((t) => ({
                id: generateUUID(),
                url: t.url,
                isThumbnail: false,
            })),
        ];
        SetProductMedia(defineThumbnail(newProductMedia));
    };

    const onToggleThumbnailUrl = (id: string) => () => {
        const newProductMedia = defineThumbnail(
            productMedia.map((m) => {
                if (m.id === id) {
                    return {
                        ...m,
                        isThumbnail: !m.isThumbnail,
                    };
                }
                return m;
            })
        );
        SetProductMedia(newProductMedia);
    };

    const onRemoveMedia = (id: string) => () => {
        const newProductMedia = defineThumbnail(
            productMedia.filter((m) => m.id !== id)
        );

        SetProductMedia(newProductMedia);
    };

    useEffect(() => {
        form.setValue(
            "base.thumbnailUrls",
            productMedia.map((media) => ({
                url: media.url,
                isThumbnail: media.isThumbnail,
            }))
        );
    }, [productMedia]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thông tin sản phẩm</CardTitle>
                <CardDescription>
                    Thông tin về mô tả, giá, ... của sản phẩm
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full">
                    <div className="w-full grid grid-cols-2 gap-5">
                        <div className="w-full">
                            <div className="w-full">
                                <FormField
                                    control={form.control}
                                    name="base.name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Tên sản phẩm <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Tên sản phẩm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="base.price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Giá gốc <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex gap-1 cursor-default ">
                                                    <Input
                                                        className="flex-1"
                                                        placeholder="Giá gốc"
                                                        type="number"
                                                        {...field}
                                                    />
                                                    <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                        <p>vnđ</p>
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Khi có các mẫu mã, giá gốc sản
                                                phẩm sẽ không được hiển thị
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="base.quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Số lượng <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    className="flex-1"
                                                    placeholder="Số lượng"
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="base.brand"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Hãng hiệu <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Hãng hiệu"
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
                                                <PopoverSelectCategory
                                                    onSelect={onSelectCategory}
                                                    selected={selectCategory}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div>
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
                                                    className="w-full !h-[300px] resize-none"
                                                    placeholder="Mô tả sản phẩm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                        <div className="w-full flex flex-col gap-2">
                            <div>
                                <Label className="leading-none text-sm">
                                    Ảnh sản phẩm <RequireField />
                                </Label>
                                <SelectMedia
                                    onSelect={onSelectProductMedia}
                                    sessionId={sessionId}
                                />
                            </div>
                            {productMedia && productMedia.length ? (
                                <div className="grid-cols-4 grid gap-2">
                                    {productMedia.map((media) => (
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
                                        Không có ảnh nào
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
