import Failure from "@/components/failure";
import Loading from "@/components/loading";
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
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import UpdateHistory from "@/components/update-history";
import { IMediaTempUpload } from "@/interface/api/media.interface";
import { IOrganizationUpdate } from "@/interface/api/organization.interface";
import { cn } from "@/lib";
import {
    organizationDetail,
    organizationUpdate,
} from "@/lib/redux/actions/organization.action";
import { organizationSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { updateOrganizationSchema } from "@/schemas/organization.schema";
import { api_media_url } from "@/utils/apiCall";
import { joinString } from "@/utils/string";
import { generateUUID } from "@/utils/uuid.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageOff, LoaderCircle, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

export default function OrganizationUpdateSreen() {
    const { id } = useParams();
    const { isUpdating, isFailure, detail, isCalling } =
        useAppSelector(organizationSelector);
    const dispatch = useAppDispatch();

    const [sessionId] = useState<string>(generateUUID());
    const [selectedLogo, SetSelectedLogo] = useState<string>("");
    const [submit, SetSubmit] = useState<boolean>(false);

    const form = useForm<z.infer<typeof updateOrganizationSchema>>({
        defaultValues: {
            address: "",
            phone: "",
            gmail: "",
            facebook: "",
            instagram: "",
            logoUrl: "",
            logoId: "",
            name: "",
            zalo: "",
        },
        resolver: zodResolver(updateOrganizationSchema),
    });

    const onSelectLogo = (url: IMediaTempUpload[]) => {
        if (url.length) {
            SetSelectedLogo(url[0].url);
            form.setValue("logoUrl", url[0].url);
        } else {
            onRemoveLogo();
        }
    };

    const onRemoveLogo = () => {
        SetSelectedLogo("");
        form.setValue("logoUrl", "");
        form.setValue("logoId", "");
    };

    const handleSubmit = () => {
        if (submit) return;

        const { logoId, logoUrl, ...data } = form.getValues();

        if (!logoId && !logoUrl) {
            form.setError("logoUrl", { message: "Logo không được để trống." });
            return;
        } else {
            SetSubmit(true);
            const body: IOrganizationUpdate = {
                ...data,
                ...(logoId ? { logoId } : {}),
                ...(logoUrl ? { logoUrl } : {}),
            };

            dispatch(organizationUpdate(body));
        }
    };

    useEffect(() => {
        if (submit && !isFailure && !isUpdating) {
            SetSubmit(false);
            toast({
                title: "Thành công",
                description: "Đã sửa thông tin doanh nghiệp.",
                duration: 1000,
            });
        }
    }, [isUpdating, isFailure, submit]);

    useEffect(() => {
        if (id) {
            dispatch(organizationDetail(id));
        }
    }, [id]);

    useEffect(() => {
        if (detail) {
            SetSubmit(false);
            form.setValue("organizationId", detail.id);
            form.setValue("logoId", detail.logoId);

            form.setValue("address", detail.address);
            form.setValue("phone", detail.phone);
            form.setValue("name", detail.name);
            form.setValue("gmail", detail.gmail);

            form.setValue("zalo", detail.zalo);
            form.setValue("facebook", detail.facebook);
            form.setValue("instagram", detail.instagram);

            if (detail.logo) {
                SetSelectedLogo(detail.logo.path);
            }
        }
    }, [detail]);

    if (!detail) {
        if (isFailure) {
            return <Failure />;
        }
        if (isCalling) {
            return <Loading />;
        }
        return <></>;
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="h-fit flex gap-5 flex-col"
            >
                <div className="h-full flex gap-5 flex-col">
                    <Card className="flex-1 flex flex-col">
                        <CardHeader>
                            <CardTitle>Thêm thông tin doanh nghiệp</CardTitle>
                            <CardDescription>
                                Thông tin doanh nghiệp sẽ được hiển thị trên
                                trang chủ mua bán.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex gap-4 h-full">
                                <div className="w-[300px] h-full">
                                    <FormField
                                        control={form.control}
                                        name="logoUrl"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>
                                                    Logo
                                                    <RequireField />
                                                </FormLabel>
                                                <FormMessage />
                                                <FormDescription>
                                                    Ảnh logo sẽ được hiển thị
                                                    trên giao diện trang chủ mua
                                                    sắm
                                                </FormDescription>

                                                <FormControl>
                                                    <div className="flex flex-col items-center justify-center gap-4 h-full">
                                                        <div className="w-full flex items-center justify-center h-fit">
                                                            <div
                                                                className={cn(
                                                                    "h-[200px] w-[200px] bg-muted border rounded-sm overflow-hidden flex items-center justify-center relative hover:border-primary",
                                                                    selectedLogo &&
                                                                        "border-primary"
                                                                )}
                                                            >
                                                                {selectedLogo ? (
                                                                    <>
                                                                        <img
                                                                            alt="preview_logo"
                                                                            src={joinString(
                                                                                {
                                                                                    joinString:
                                                                                        "",
                                                                                    strings:
                                                                                        [
                                                                                            api_media_url,
                                                                                            selectedLogo,
                                                                                        ],
                                                                                }
                                                                            )}
                                                                            className="w-full h-full object-cover"
                                                                        />
                                                                        <div className="absolute right-2 top-2">
                                                                            <Button
                                                                                className="h-fit w-fit p-2"
                                                                                size={
                                                                                    "icon"
                                                                                }
                                                                                onClick={
                                                                                    onRemoveLogo
                                                                                }
                                                                                type="button"
                                                                            >
                                                                                <XIcon
                                                                                    size={
                                                                                        12
                                                                                    }
                                                                                />
                                                                            </Button>
                                                                        </div>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex flex-col gap-1 text-muted-foreground text-sm items-center">
                                                                        <span>
                                                                            <ImageOff
                                                                                size={
                                                                                    15
                                                                                }
                                                                            />
                                                                        </span>
                                                                        <span>
                                                                            Chưa
                                                                            có
                                                                            logo
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="w-full h-fit flex flex-col items-center justify-center">
                                                            <p className="text-center text-xs text-muted-foreground">
                                                                Chọn ảnh có kích
                                                                thước nhỏ hơn
                                                                5mb.
                                                            </p>
                                                            <SelectMedia
                                                                sessionId={
                                                                    sessionId
                                                                }
                                                                onSelect={
                                                                    onSelectLogo
                                                                }
                                                                accept="image/*"
                                                                mutiple={false}
                                                            />
                                                        </div>
                                                    </div>
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Separator
                                    orientation="vertical"
                                    className="h-auto"
                                />
                                <div className="flex-1 flex flex-col gap-3">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-7 items-start gap-5">
                                                    <FormLabel className="col-span-2 w-full text-right text-muted-foreground text-sm mt-3">
                                                        Tên
                                                        <RequireField />
                                                    </FormLabel>
                                                    <div className="col-span-5">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Tên"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormDescription>
                                                            Tên hiển thị trên
                                                            trang chủ mua sắm,
                                                            ngắn gọn, dưới 15
                                                            chữ cái
                                                        </FormDescription>
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="address"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-7 items-start gap-5">
                                                    <FormLabel className="col-span-2 w-full text-right text-muted-foreground text-sm mt-3">
                                                        Địa chỉ
                                                        <RequireField />
                                                    </FormLabel>
                                                    <div className="col-span-5">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Địa chỉ"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-7 items-start gap-5">
                                                    <FormLabel className="col-span-2 w-full text-right text-muted-foreground text-sm mt-3">
                                                        Số điện thoại
                                                        <RequireField />
                                                    </FormLabel>
                                                    <div className="col-span-5">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Số điện thoại"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="gmail"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-7 items-start gap-5">
                                                    <FormLabel className="col-span-2 w-full text-right text-muted-foreground text-sm mt-3">
                                                        Email
                                                        <RequireField />
                                                    </FormLabel>
                                                    <div className="col-span-5">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Email"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <Separator
                                        orientation="horizontal"
                                        className="my-3"
                                    />
                                    <FormField
                                        control={form.control}
                                        name="facebook"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-7 items-start gap-5">
                                                    <FormLabel className="col-span-2 w-full text-right text-muted-foreground text-sm mt-3">
                                                        Facebook
                                                    </FormLabel>
                                                    <div className="col-span-5">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Facebook"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="zalo"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-7 items-start gap-5">
                                                    <FormLabel className="col-span-2 w-full text-right text-muted-foreground text-sm mt-3">
                                                        Zalo
                                                    </FormLabel>
                                                    <div className="col-span-5">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Zalo"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="instagram"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className="grid grid-cols-7 items-start gap-5">
                                                    <FormLabel className="col-span-2 w-full text-right text-muted-foreground text-sm mt-3">
                                                        Instagram
                                                    </FormLabel>
                                                    <div className="col-span-5">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Instagram"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </div>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <UpdateHistory
                        userCreate={detail.userCreate}
                        userUpdate={detail.userUpdate}
                        createdAt={detail.createdAt}
                        updatedAt={detail.updatedAt}
                    />
                    <div className="w-full justify-end flex">
                        <Button
                            type="submit"
                            className="items-center gap-2"
                            disabled={isUpdating && submit && !isFailure}
                        >
                            {isUpdating && submit && !isFailure && (
                                <LoaderCircle size={15} />
                            )}
                            Sửa thông tin
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    );
}
