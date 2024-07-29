import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import {
    MAX_FILE_IMAGE_SIZE_MB,
    MAX_FILE_IMAGES_SIZE_BYTES,
    MAX_FILE_VIDEO_SIZE_MB,
    MAX_FILE_VIDEOS_SIZE_BYTES,
} from "@/constants/file.constant";
import { uploadMediaApi } from "@/lib/redux/actions/media.action";
import { mediaSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
    ArrowUpFromLineIcon,
    LoaderCircleIcon,
    PlusIcon,
    XIcon,
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";

interface UploadedFile {
    file: File;
    preview: string;
}

const LIMIT_FILES = 10;

export default function UploadMediaDialog() {
    const imageRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLInputElement>(null);

    const dispatch = useAppDispatch();
    const { isCreating, isFailure } = useAppSelector(mediaSelector);

    const [open, SetOpen] = useState<boolean>(false);
    const [videos, SetVideos] = useState<UploadedFile[]>([]);
    const [images, SetImages] = useState<UploadedFile[]>([]);

    const resetForm = () => {
        SetVideos([]);
        SetImages([]);
    };

    const handleDeleteTemp = (index: number, type: "i" | "v") => () => {
        if (type === "i") {
            SetImages((imgs) => imgs.filter((_, id) => id !== index));
        }
        if (type === "v") {
            SetVideos((vds) => vds.filter((_, id) => id !== index));
        }
    };

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const filesArray = Array.from(e.target.files);
        if (filesArray.length + videos.length + images.length > LIMIT_FILES) {
            toast({
                variant: "destructive",
                title: "Tải thất bại",
                description: `Form không thế chứa quá ${LIMIT_FILES} tệp.`,
            });
            return;
        }
        const imagesData: UploadedFile[] = [];
        const videosData: UploadedFile[] = [];

        filesArray.forEach((file) => {
            if (
                file.size > MAX_FILE_IMAGES_SIZE_BYTES &&
                file.type.startsWith("image")
            ) {
                toast({
                    variant: "destructive",
                    title: "Tải thất bại",
                    description: `kích cỡ tệp ${file.name} quá lớn, tối da ${MAX_FILE_IMAGE_SIZE_MB} MB.`,
                });
                return; // Skip this file
            }

            if (
                file.size > MAX_FILE_VIDEOS_SIZE_BYTES &&
                file.type.startsWith("video")
            ) {
                toast({
                    variant: "destructive",
                    title: "Tải thất bại",
                    description: `kích cỡ tệp ${file.name} quá lớn, tối da ${MAX_FILE_VIDEO_SIZE_MB} MB.`,
                });
                return; // Skip this file
            }

            const reader = new FileReader();
            reader.onload = (event) => {
                if (event?.target?.result) {
                    if (file.type.startsWith("image")) {
                        imagesData.push({
                            preview: event.target.result.toString(),
                            file: file,
                        });
                    } else if (file.type.startsWith("video")) {
                        videosData.push({
                            preview: event.target.result.toString(),
                            file: file,
                        });
                    }

                    if (
                        imagesData.length + videosData.length ===
                        filesArray.length
                    ) {
                        SetImages((images) => [...images, ...imagesData]);
                        SetVideos((videos) => [...videos, ...videosData]);
                        e.target.value = "";
                    }
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = () => {
        const formData = new FormData();

        images.forEach((image) => {
            formData.append("medias", image.file);
        });

        videos.forEach((video) => {
            formData.append("medias", video.file);
        });

        dispatch(uploadMediaApi(formData));
    };

    useEffect(() => {
        if (!isCreating && !isFailure) {
            SetOpen(false);
        }
    }, [isCreating, isFailure]);

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger>
                <Button className="gap-1" onClick={resetForm}>
                    <PlusIcon size={14} />
                    <p className="font-normal">Tạo mới</p>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[2/3] w-2/3">
                <DialogHeader>
                    <DialogTitle>Nhập thêm file phương tiện </DialogTitle>
                    <DialogDescription>
                        Tệp ảnh không quá {MAX_FILE_IMAGE_SIZE_MB}MB
                        <br />
                        Tệp video không quá {MAX_FILE_VIDEO_SIZE_MB}MB
                    </DialogDescription>
                </DialogHeader>
                <Separator orientation="horizontal" />
                <div className="w-full flex gap-2">
                    <div className="flex-1">
                        <div>
                            <Label htmlFor="uploads-images">
                                Ảnh {images.length}
                            </Label>
                            <Input
                                id="uploads-images"
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                multiple
                                className="hidden"
                                ref={imageRef}
                            />
                        </div>
                        <Card className="w-full max-h-[500px] overflow-y-auto grid grid-cols-5 gap-2 box-border p-2">
                            {videos.length + images.length < LIMIT_FILES && (
                                <div>
                                    <Label
                                        htmlFor="uploads-images"
                                        className="text-xs font-normal w-full aspect-square rounded-md overflow-hidden border flex items-center justify-center cursor-pointer hover:bg-black hover:bg-opacity-15"
                                    >
                                        Chọn ảnh
                                    </Label>
                                </div>
                            )}
                            {images.map((file, index) => (
                                <div key={Math.random() * new Date().getTime()}>
                                    <div className="w-full aspect-square rounded-md overflow-hidden border flex items-center justify-center group/image relative">
                                        <div className="group-hover/image:block w-full h-full absolute top-0 left-0 bg-black bg-opacity-50 hidden">
                                            <p className=" text-background text-xs absolute bottom-2 left-2 ">
                                                {Math.round(
                                                    file.file.size / 1024
                                                )}
                                                kb
                                            </p>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="absolute right-2 top-2 p-0 rounded-full w-4 h-4"
                                                onClick={handleDeleteTemp(
                                                    index,
                                                    "i"
                                                )}
                                            >
                                                <XIcon size={10} />
                                            </Button>
                                        </div>
                                        <img
                                            src={file.preview}
                                            alt={`Uploaded ${index}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            ))}
                        </Card>
                        <div className="w-full text-muted-foreground text-xs mt-1">
                            <p>{images.length} Ảnh</p>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div>
                            <Label htmlFor="uploads-videos">
                                Video {videos.length}
                            </Label>
                            <Input
                                id="uploads-videos"
                                type="file"
                                accept="video/*"
                                onChange={handleImage}
                                multiple
                                className="hidden"
                            />
                        </div>
                        <Card className="w-full max-h-[500px] overflow-y-auto grid grid-cols-2 gap-2 box-border p-2">
                            {videos.length + images.length < LIMIT_FILES && (
                                <div>
                                    <Label
                                        htmlFor="uploads-videos"
                                        className="text-xs font-normal w-full aspect-square rounded-md overflow-hidden border flex items-center justify-center cursor-pointer hover:bg-black hover:bg-opacity-15"
                                    >
                                        Chọn video
                                    </Label>
                                </div>
                            )}
                            {videos.map((file, index) => (
                                <div key={Math.random() * new Date().getTime()}>
                                    <div className="w-full aspect-square rounded-md overflow-hidden border flex items-center justify-center group/video relative">
                                        <div className="group-hover/video:flex justify-between p-2 w-full h-fit absolute top-0 left-0 bg-black bg-opacity-50 hidden z-[1]">
                                            <p className=" text-background text-xs">
                                                {Math.round(
                                                    file.file.size / 1024
                                                )}
                                                kb
                                            </p>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="p-0 rounded-full w-4 h-4"
                                                onClick={handleDeleteTemp(
                                                    index,
                                                    "v"
                                                )}
                                            >
                                                <XIcon size={10} />
                                            </Button>
                                        </div>
                                        <video
                                            src={file.preview}
                                            controls
                                            className="w-full h-full object-cover z-0"
                                        />
                                    </div>
                                </div>
                            ))}
                        </Card>
                        <div className="w-full text-muted-foreground text-xs mt-1">
                            <p>{videos.length} Video</p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <div className="w-full flex justify-between items-center">
                        <div>
                            <p className="text-xs text-muted-foreground italic">
                                {videos.length + images.length}/{LIMIT_FILES}{" "}
                                tệp phương tiện
                            </p>
                        </div>
                        <div className="w-fit flex gap-2">
                            <Button
                                onClick={() => {
                                    resetForm();
                                    SetOpen(false);
                                }}
                                className="gap-2"
                                disabled={isCreating}
                                variant="outline"
                            >
                                <XIcon size={15} /> Hủy
                            </Button>
                            <Button
                                onClick={handleUpload}
                                className="gap-2"
                                disabled={isCreating}
                            >
                                {isCreating ? (
                                    <LoaderCircleIcon
                                        size={15}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <ArrowUpFromLineIcon size={15} />
                                )}
                                Tải {videos.length + images.length} tệp
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
