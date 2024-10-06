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
import { Separator } from "@/components/ui/separator";
import { ICategory } from "@/interface/api/category.interface";
import { createCategoryApi } from "@/lib/redux/actions/category.action";
import { categorySelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { createCategorySchema } from "@/schemas/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon, PlusIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface ICreateCategoryDialogProps {}

export default function CreateCategoryDialog({}: ICreateCategoryDialogProps) {
    const dispatch = useAppDispatch();
    const { isCreating, isFailure } = useAppSelector(categorySelector);

    const [file, setFile] = useState<File | null>(null);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [open, SetOpen] = useState<boolean>(false);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [select, SetSelect] = useState<ICategory | null>(null);

    const resetForm = () => {
        clearImage();
        SetSelect(null);
        form.reset();
    };

    const clearImage = () => {
        setFile(null);
        setPreviewUrl("");
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

    const handleSubmit = (values: z.infer<typeof createCategorySchema>) => {
        const formData = new FormData();

        formData.append("title", values.title);
        if (values.parentId) {
            formData.append("parentId", values.parentId);
        }

        if (file) {
            formData.append("image", file);
        }
        dispatch(createCategoryApi(formData));
    };

    const handleSelectParent = (item: ICategory | null) => {
        form.setValue("parentId", item?.id || "");
        SetSelect(item);
    };

    const form = useForm<z.infer<typeof createCategorySchema>>({
        defaultValues: {
            parentId: "",
            title: "",
        },
        resolver: zodResolver(createCategorySchema),
    });

    useEffect(() => {
        if (!isCreating && !isFailure) {
            SetOpen(false);
        }
    }, [isCreating, isFailure, submit]);

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger>
                <Button className="gap-1" onClick={resetForm}>
                    <PlusIcon size={14} />
                    <p className="font-normal">Tạo mới</p>
                </Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tạo danh mục sản phẩm</DialogTitle>
                    <DialogDescription>
                        Danh mục sản phẩm đươc dùng để phân loại sản phấm.
                    </DialogDescription>
                </DialogHeader>

                <Separator orientation="horizontal" />
                <div className="flex flex-col gap-1 w-full">
                    {/* <div className="grid w-full max-w-sm items-center gap-1">
                        <Label htmlFor="image-new-category">Ảnh danh mục</Label>
                        <Input
                            id="image-new-category"
                            type="file"
                            onChange={handleImage}
                            className="hidden"
                            multiple={false}
                            accept="image/*"
                        />
                        <div className="w-[100px] h-[100px] overflow-hidden rounded-lg relative border box-border">
                            {previewUrl ? (
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
                                        src={previewUrl}
                                        alt="preview"
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ) : (
                                <Label
                                    htmlFor="image-new-category"
                                    className="flex w-full h-full items-center justify-center cursor-pointer hover:bg-black hover:bg-opacity-20"
                                >
                                    <p className="font-normal text-xs">
                                        Chọn ảnh
                                    </p>
                                </Label>
                            )}
                        </div>
                    </div> */}

                    <PopoverSelectParent
                        onSelectParent={handleSelectParent}
                        selected={select}
                    />

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
                                    disabled={isCreating}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        SetOpen(false);
                                    }}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isCreating}
                                    className="gap-1"
                                >
                                    {isCreating && (
                                        <LoaderCircleIcon
                                            size={15}
                                            className="animate-spin"
                                        />
                                    )}
                                    Tạo danh mục
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
