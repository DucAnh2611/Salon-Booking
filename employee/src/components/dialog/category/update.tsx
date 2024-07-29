import PopoverSelectParent from "@/components/popover/category/select-parent";
import RequireField from "@/components/require-field";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ICategory } from "@/interface/api/category.interface";
import { updateCategoryApi } from "@/lib/redux/actions/category.action";
import { categorySelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { updateCategorySchema } from "@/schemas/category.schema";
import { api_media_url } from "@/utils/apiCall";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, PencilLineIcon, XIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface IUpdateCategoryDialogProps {
    item: ICategory;
}

export default function UpdateCategoryDialog({
    item,
}: IUpdateCategoryDialogProps) {
    const dispatch = useAppDispatch();
    const { isUpdating, isFailure } = useAppSelector(categorySelector);

    const [file, setFile] = useState<File | null>(null);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [open, SetOpen] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [updateItem, SetUpdateItem] = useState<ICategory>(item);
    const [select, SetSelect] = useState<ICategory | null>(item.parent || null);

    const resetForm = () => {
        form.reset();
        setFile(null);
        setPreviewUrl("");
        SetSelect(item.parent);
    };

    const clearImage = () => {
        setFile(null);
        setPreviewUrl("");
        SetUpdateItem({
            ...updateItem,
            image: null,
        });
    };

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event?.target?.result)
                    setPreviewUrl(event.target.result.toString());
            };
            reader.readAsDataURL(selectedFile);

            setFile(selectedFile);
        }
    };

    const handleSubmit = (values: z.infer<typeof updateCategorySchema>) => {
        const formData = new FormData();

        formData.append("title", values.title);
        if (values.parentId) {
            formData.append("parentId", values.parentId);
        }

        if (file) {
            formData.append("image", file);
        }

        if (updateItem.image?.id) {
            formData.append("imageId", updateItem.image.id);
        }

        SetSubmit(true);
        dispatch(updateCategoryApi(updateItem.id, formData));
    };

    const handleSelectParent = (item: ICategory | null) => {
        form.setValue("parentId", item?.id || "");
        SetSelect(item);
    };

    const form = useForm<z.infer<typeof updateCategorySchema>>({
        defaultValues: {
            parentId: item.parent ? item.parent.id : "",
            title: item.title,
        },
        resolver: zodResolver(updateCategorySchema),
    });

    useEffect(() => {
        if (submit && !isUpdating && !isFailure) {
            SetOpen(false);
        }
    }, [isUpdating, isFailure, submit]);

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger className="w-full" asChild>
                <Button
                    className="gap-2 w-full justify-start px-2"
                    variant="ghost"
                    onClick={resetForm}
                >
                    <PencilLineIcon size={13} />
                    Sửa
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cập nhật danh mục sản phẩm</DialogTitle>
                    <DialogDescription>
                        Danh mục sản phẩm đươc dùng để phân loại sản phấm.
                    </DialogDescription>
                </DialogHeader>
                <Separator orientation="horizontal" />
                <div className="flex flex-col gap-1 w-full">
                    <div className="grid w-full max-w-sm items-center gap-1">
                        <Label htmlFor="image-update-category">
                            Ảnh danh mục
                        </Label>
                        <Input
                            id="image-update-category"
                            type="file"
                            onChange={handleImage}
                            className="hidden"
                            multiple={false}
                            accept="image/*"
                        />
                        <div className="w-[100px] h-[100px] overflow-hidden rounded-lg relative border box-border">
                            {previewUrl || updateItem.image ? (
                                <div className="w-full h-full group/group1">
                                    <div className="absolute top-0 left-0 w-full h-full hidden gap-2 bg-black bg-opacity-50 group-hover/group1:block">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="w-5 h-5 p-0 rounded-full absolute right-1 top-1"
                                            onClick={clearImage}
                                        >
                                            <XIcon size={10} />
                                        </Button>
                                    </div>
                                    <img
                                        src={
                                            previewUrl ||
                                            api_media_url +
                                                updateItem.image?.path
                                        }
                                        alt="preview"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ) : (
                                <Label
                                    htmlFor="image-update-category"
                                    className="flex w-full h-full items-center justify-center cursor-pointer hover:bg-black hover:bg-opacity-20"
                                >
                                    <p className="font-normal text-xs">
                                        Chọn ảnh
                                    </p>
                                </Label>
                            )}
                        </div>
                    </div>

                    <PopoverSelectParent
                        onSelectParent={handleSelectParent}
                        selected={select}
                    ></PopoverSelectParent>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Tên danh mục
                                            <RequireField />
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tên danh mục"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter className="mt-2">
                                <Button
                                    variant="outline"
                                    disabled={isUpdating}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        SetOpen(false);
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="gap-1"
                                >
                                    {isUpdating && (
                                        <LoaderCircleIcon
                                            size={15}
                                            className="animate-spin"
                                        />
                                    )}
                                    Cập nhật
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
