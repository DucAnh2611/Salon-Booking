import RequireField from "@/components/require-field";
import SelectMedia from "@/components/select/select-media";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IMediaTempUpload } from "@/interface/api/media.interface";
import { IServiceStep } from "@/interface/api/service.interface";
import { cn } from "@/lib";
import { api_media_url } from "@/utils/apiCall";
import { getMediaType } from "@/utils/media-checker.util";
import { ChangeEvent, useState } from "react";

interface IDialogCreateStepService {
    onCreate: (step: IServiceStep) => void;
    stepNums: number;
    sessionId: string;
}

export default function DialogCreateStepService({
    stepNums,
    onCreate,
    sessionId,
}: IDialogCreateStepService) {
    const [media, SetMedia] = useState<IMediaTempUpload | null>(null);
    const [open, SetOpen] = useState<boolean>(false);
    const [newStep, SetNewStep] = useState<IServiceStep>({
        description: "",
        name: "",
        thumbnailId: "",
        thumbnailUrl: "",
    });

    const [err, SetErr] = useState<IServiceStep>({
        description: "",
        name: "",
        thumbnailId: "",
        thumbnailUrl: "",
    });

    const reset = () => {
        SetMedia(null);
        SetNewStep({
            description: "",
            name: "",
            thumbnailId: "",
            thumbnailUrl: "",
        });
        SetErr({
            description: "",
            name: "",
            thumbnailId: "",
            thumbnailUrl: "",
        });
    };

    const handleOnChange =
        (key: keyof Omit<IServiceStep, "mediaId" | "mediaUrl">) =>
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            SetNewStep({
                ...newStep,
                [key]: e.target.value,
            });
            SetErr({
                description: "",
                name: "",
                thumbnailId: "",
                thumbnailUrl: "",
            });
        };

    const onClickOpen = () => {
        SetOpen(true);
        reset();
    };

    const handleSubmit = () => {
        if (newStep.name.length) {
            onCreate({ ...newStep, thumbnailUrl: media ? media.url : "" });
            SetOpen(false);
        } else {
            SetErr({
                ...err,
                name: "Tên bước không thể để trống",
            });
        }
    };

    const onSelectProductMedia = (temp: IMediaTempUpload[]) => {
        SetMedia(temp.length ? temp[temp.length - 1] : null);
    };

    const onRemoveMedia = () => () => {
        SetMedia(null);
    };

    const handleClose = () => {
        SetOpen(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="secondary" onClick={onClickOpen}>
                    Thêm bước {stepNums}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm bước làm của dịch vụ</DialogTitle>
                </DialogHeader>
                <div>
                    <div>
                        <FormLabel>Ảnh, Video (Chọn 1)</FormLabel>
                        <div className="w-full flex flex-col gap-2">
                            <div>
                                <SelectMedia
                                    onSelect={onSelectProductMedia}
                                    sessionId={sessionId}
                                    mutiple={false}
                                />
                            </div>
                            {media ? (
                                <div className="w-full ">
                                    <div
                                        className="w-full aspect-video rounded-md overflow-hidden relative group/preview"
                                        key={media.url}
                                    >
                                        <div
                                            className={cn(
                                                "group-hover/preview:flex flex absolute w-full h-full top-0 left-0 bg-transparent items-start justify-end rounded-md z-[1]"
                                            )}
                                        >
                                            <div className=" w-full h-full group-hover/preview:flex flex-col hidden items-center bg-black bg-opacity-10 justify-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    className="gap-1 w-[70%]"
                                                    size="sm"
                                                    onClick={onRemoveMedia()}
                                                >
                                                    Xóa
                                                </Button>
                                            </div>
                                        </div>

                                        {getMediaType(media.url) === "image" ? (
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
                                                src={api_media_url + media.url}
                                                controls
                                                className="w-full h-full object-cover"
                                            />
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="w-full p-10 border rounded border-dashed">
                                    <p className="w-full text-xs text-center">
                                        Không có ảnh, video nào
                                    </p>
                                </div>
                            )}
                        </div>
                        <div>
                            <FormLabel>
                                Tên <RequireField />
                            </FormLabel>
                            <Input
                                placeholder="Tên"
                                onChange={handleOnChange("name")}
                            />
                            {err.name.length !== 0 && (
                                <p className="text-xs text-destructive">
                                    {err.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <FormLabel>Mô tả</FormLabel>
                            <Textarea
                                placeholder="Mô tả"
                                className="resize-none h-[300px]"
                                onChange={handleOnChange("description")}
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-5">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="button"
                            variant="default"
                            onClick={handleSubmit}
                        >
                            Thêm
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
