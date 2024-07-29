import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { IMedia } from "@/interface/api/media.interface";
import { updateMediaApi } from "@/lib/redux/actions/media.action";
import { mediaSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { api_media_url } from "@/utils/apiCall";
import { getMediaType } from "@/utils/media-checker.util";
import {
    CopyIcon,
    LoaderCircleIcon,
    PencilIcon,
    PencilLineIcon,
    XIcon,
} from "lucide-react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import DeleteMediaDialog from "./delete";

interface IPreviewMediaDialogProps {
    media: IMedia;
}
export function PreviewMediaDialog({ media }: IPreviewMediaDialogProps) {
    const editRef = useRef<HTMLInputElement>(null);
    const dispatch = useAppDispatch();
    const { isDeleting, isUpdating, isFailure } = useAppSelector(mediaSelector);

    const [open, SetOpen] = useState<boolean>(false);
    const [edit, SetEdit] = useState<boolean>(false);
    const [mediaTitle, SetMediaTitle] = useState<string>(media.title);
    const [error, SetError] = useState<boolean>(false);

    const reset = () => {
        SetEdit(false);
    };

    const toggleEdit = () => {
        SetEdit(!edit);
    };

    const onCopyClipboard = () => {
        navigator.clipboard.writeText(api_media_url + media.path);
        toast({
            title: "Sao chép thành công!",
            description: "Đã sao chép đường dẫn ảnh.",
        });
    };

    const handleChangeMediaTitle = (e: ChangeEvent<HTMLInputElement>) => {
        SetMediaTitle(e.target.value);
        if (error) {
            SetError(false);
        }
    };

    const onDelete = () => {};

    const onUpdate = () => {
        if (!mediaTitle) {
            SetError(true);
            return;
        } else dispatch(updateMediaApi(media.id, { title: mediaTitle }));
    };

    useEffect(() => {
        if (!isFailure && (!isUpdating || !isDeleting)) {
            SetOpen(false);
        }
    }, [isFailure, isUpdating, isDeleting]);

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-full h-full aspect-square group/mediaPreview relative hover:cursor-pointer bg-transparent hover:bg-transparent p-0 rounded-md overflow-hidden"
                    variant="outline"
                    onClick={reset}
                >
                    {getMediaType(media.path) === "image" ? (
                        <img
                            src={api_media_url + media.path}
                            alt={media.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <video
                            src={api_media_url + media.path}
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute w-full h-full top-0 left-0">
                        <div className="text-xs text-muted w-full h-fit text-left absolute bottom-0 left-0 group-hover/mediaPreview:block p-2 bg-black bg-opacity-60 hidden">
                            <p className="text-xs text-white w-full h-fit text-left text-wrap break-words line-clamp-3">
                                {media.title}
                            </p>
                        </div>
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent className="h-fit max-w-[30%] w-fit max-h-[90%]">
                <DialogHeader>
                    <DialogTitle>File phương tiện</DialogTitle>
                </DialogHeader>
                <div className="w-full h-fit rounded-md flex flex-col gap-2">
                    {getMediaType(media.path) === "image" ? (
                        <img
                            src={api_media_url + media.path}
                            alt={media.title}
                            className="w-full h-auto object-cover border-2 rounded-md"
                        />
                    ) : (
                        <video
                            src={api_media_url + media.path}
                            controls
                            className="w-full h-auto object-cover border-2 rounded-md"
                        />
                    )}
                    <div>
                        <div className="flex w-full items-center gap-2">
                            <Label className="w-fit mr-3">Tên</Label>
                            <Input
                                ref={editRef}
                                disabled={!edit}
                                value={mediaTitle}
                                className="flex-1"
                                onChange={handleChangeMediaTitle}
                            />
                            {!edit && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={toggleEdit}
                                >
                                    <PencilIcon size={15} />
                                </Button>
                            )}
                        </div>
                        {error && (
                            <p className="text-xs text-destructive mt-1">
                                {ZOD_MESSAGE.min(1, "Tên phương tiện")}
                            </p>
                        )}
                    </div>
                    <div className="flex w-full items-center gap-2">
                        <Label className="w-fit mr-3">Đường dẫn</Label>
                        <Input
                            disabled={true}
                            value={api_media_url + media.path}
                            className="flex-1"
                        />
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onCopyClipboard}
                        >
                            <CopyIcon size={15} />
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex gap-1 w-full">
                        {edit ? (
                            <>
                                <Button
                                    className="flex-1 gap-2"
                                    variant="outline"
                                    onClick={toggleEdit}
                                    disabled={isUpdating}
                                >
                                    <XIcon size={15} />
                                    <p>Hủy</p>
                                </Button>
                                <Button
                                    className="flex-1 gap-2"
                                    variant="default"
                                    onClick={onUpdate}
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? (
                                        <LoaderCircleIcon
                                            size={15}
                                            className="animate-spin"
                                        />
                                    ) : (
                                        <PencilLineIcon size={15} />
                                    )}
                                    <p>Xác nhận</p>
                                </Button>
                            </>
                        ) : (
                            <>
                                <DeleteMediaDialog id={media.id} />
                                <Button
                                    className="flex-1 gap-2"
                                    variant="default"
                                    onClick={toggleEdit}
                                >
                                    <PencilLineIcon size={15} />
                                    <p>Cập nhật</p>
                                </Button>
                            </>
                        )}
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
