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
import { joinString } from "@/utils/string";
import { ChangeEvent, useState } from "react";

interface IDialogUpdateStepService {
    onCreate: (step: IServiceStep) => void;
    step: IServiceStep;
    sessionId: string;
    defaultMedia?: string | null;
}

export default function DialogUpdateStepService({
    step,
    onCreate,
    sessionId,
    defaultMedia,
}: IDialogUpdateStepService) {
    const [media, SetMedia] = useState<IMediaTempUpload | null>();
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
        SetNewStep({
            name: step.name,
            description: step.description,
            thumbnailId: step.thumbnailId || "",
            thumbnailUrl: defaultMedia ? defaultMedia : step.thumbnailUrl || "",
        });
        SetErr({
            description: "",
            name: "",
            thumbnailId: "",
            thumbnailUrl: "",
        });
        SetMedia(null);
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
        if (!!newStep.name.length && newStep.name.length >= 20) {
            onCreate({
                ...newStep,
                ...(media
                    ? {
                          thumbnailUrl: media.url,
                      }
                    : {
                          thumbnailUrl:
                              !newStep.thumbnail && !!step.thumbnailUrl
                                  ? step.thumbnailUrl
                                  : "",
                      }),
            });
            SetOpen(false);
        } else if (!newStep.name.length) {
            SetErr({
                ...err,
                name: "Tên bước không thể để trống",
            });
        } else if (newStep.description.length < 20) {
            SetErr({
                ...err,
                description: "Mô tả ít nhất 20 ký tự",
            });
        }
    };

    const onSelectProductMedia = (temp: IMediaTempUpload[]) => {
        SetMedia(!!temp.length ? temp[temp.length - 1] : null);
    };

    const onRemoveMedia = () => () => {
        SetMedia(null);
        SetNewStep((s) => ({
            ...s,
            thumbnailUrl: "",
        }));
    };

    const handleClose = () => {
        SetOpen(false);
        reset();
    };

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant="secondary" onClick={onClickOpen}>
                    Sửa
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sửa bước làm của dịch vụ</DialogTitle>
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
                            {media || !!newStep.thumbnailUrl ? (
                                <div className="w-full ">
                                    <div
                                        className="w-full aspect-video rounded-md overflow-hidden relative group/preview"
                                        key={
                                            media
                                                ? media.url
                                                : newStep.thumbnailUrl || ""
                                        }
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

                                        {getMediaType(
                                            media
                                                ? media.url
                                                : step.thumbnailUrl || ""
                                        ) === "image" ? (
                                            <>
                                                <img
                                                    src={joinString({
                                                        joinString: "",
                                                        strings: [
                                                            api_media_url,
                                                            media
                                                                ? media.url
                                                                : newStep.thumbnailUrl ||
                                                                  "",
                                                        ],
                                                    })}
                                                    alt="product-temp"
                                                    className="w-full h-full object-cover"
                                                />
                                            </>
                                        ) : (
                                            <video
                                                src={joinString({
                                                    joinString: "",
                                                    strings: [
                                                        api_media_url,
                                                        media
                                                            ? media.url
                                                            : newStep.thumbnailUrl ||
                                                              "",
                                                    ],
                                                })}
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
                                value={newStep.name}
                            />
                            {err.name.length !== 0 && (
                                <p className="text-xs text-destructive">
                                    {err.name}
                                </p>
                            )}
                        </div>
                        <div>
                            <FormLabel>
                                Mô tả
                                <RequireField />
                            </FormLabel>
                            <Textarea
                                placeholder="Mô tả"
                                className="resize-none h-[150px]"
                                onChange={handleOnChange("description")}
                                value={newStep.description}
                            />
                            {err.description.length !== 0 && (
                                <p className="text-xs text-destructive">
                                    {err.description}
                                </p>
                            )}
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
                            Sửa
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
