import { API_URLS } from "@/constants/api.constant";
import { IMediaTempUpload } from "@/interface/api/media.interface";
import { apiCall } from "@/utils/apiCall";
import { generateUUID } from "@/utils/uuid.utils";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { FolderUpIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "../ui/use-toast";

interface ISelectMediaProps {
    onSelect: (urls: IMediaTempUpload[]) => void;
    sessionId: string;
    disabled?: boolean;
    mutiple?: boolean;
    accept?: string;
    id?: string;
}

export default function SelectMedia({
    onSelect,
    sessionId,
    disabled = false,
    mutiple = true,
    accept = "image/*, video/*",
    id,
}: ISelectMediaProps) {
    const [uuid] = useState<string>(generateUUID());

    const tempUpload = async (file: File) => {
        const formData = new FormData();

        formData.append("file", file);
        formData.append("sessionId", sessionId);

        const api = API_URLS.MEDIA.TEMP_UPLOAD();

        const { response } = await apiCall<IMediaTempUpload>({
            ...api,
            payload: formData,
        });
        if (response) {
            return {
                ...response.result,
            } as IMediaTempUpload;
        }
        return null;
    };

    const handleSelectMedia = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }

        const arrFile = Array.from(e.target.files);
        const uploadTemp = await Promise.all(
            arrFile.map((file) => tempUpload(file))
        );

        const filterNullTemp = uploadTemp.filter(
            (item) => !!item
        ) as IMediaTempUpload[];

        if (filterNullTemp.length !== arrFile.length) {
            toast({
                title: "Cảnh báo",
                description:
                    "Một số tệp tải lên không thành công, vui lại xem lại kích thước và loại tệp.",
            });
        }
        e.target.value = "";
        onSelect(filterNullTemp);
    };

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        type="button"
                        className="mt-2 w-full"
                        disabled={disabled}
                    >
                        Chọn tệp
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" side="bottom">
                    {/* <DropdownMenuItem>
                        <Button
                            className="items-center w-full justify-start gap-2"
                            variant="ghost"
                        >
                            <div className="w-[20px]">
                                <ArchiveRestoreIcon size={15} />
                            </div>
                            Chọn từ tệp đã tải lên
                        </Button>
                    </DropdownMenuItem> */}
                    <DropdownMenuItem>
                        <Label
                            className="items-center w-full justify-start gap-2 flex px-4 py-3 hover:bg-muted rounded cursor-pointer"
                            htmlFor={id ? id : "select-media" + uuid}
                        >
                            <div className="w-[20px]">
                                <FolderUpIcon size={15} />
                            </div>
                            Chọn từ máy
                        </Label>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Input
                type="file"
                accept={accept}
                className="hidden"
                id={id ? id : "select-media" + uuid}
                multiple={mutiple}
                onChange={handleSelectMedia}
            />
        </div>
    );
}
