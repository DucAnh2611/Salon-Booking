import { IUserEmployee } from "@/interface/api/employee.interface";
import { api_media_url } from "@/utils/apiCall";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";

interface IUpdateHistoryProps {
    updatedAt?: Date;
    createdAt?: Date;
    userUpdate?: IUserEmployee;
    userCreate?: IUserEmployee;
}
export default function UpdateHistory({
    userCreate,
    userUpdate,
    createdAt,
    updatedAt,
}: IUpdateHistoryProps) {
    if (!userCreate && !userUpdate) {
        return (
            <div className="w-full h-fit box-border p-5 py-10 border">
                <p className="text-xs text-center w-full">
                    Không có lịch sử cập nhật
                </p>{" "}
            </div>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="text-xl">Lịch sử cập nhật</CardTitle>
            </CardHeader>
            <CardContent className="w-full grid grid-cols-2">
                {userCreate && (
                    <div className="w-full flex flex-col gap-5 h-[100px]">
                        <Label>Tạo bởi</Label>
                        <div className="flex-1 flex justify-start items-start gap-4">
                            <div className="h-full aspect-square ">
                                <Avatar className="h-full w-full">
                                    <AvatarImage
                                        src={`${api_media_url}${userCreate?.userAvatar?.path}`}
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback className="bg-primary">
                                        {userCreate?.userBase.lastname
                                            .charAt(0)
                                            .toUpperCase()}
                                        {userCreate?.userBase.firstname
                                            .charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="text-sm flex flex-col justify-between h-full">
                                <p>
                                    <b>Tên:</b> {userCreate.userBase.lastname}{" "}
                                    {userCreate.userBase.firstname}
                                </p>
                                <p>
                                    <b className="mr-2">Chức vụ:</b>
                                    <Badge variant="outline">
                                        {userCreate.eRole.title}
                                    </Badge>
                                </p>
                                {updatedAt && (
                                    <p>
                                        <b>Thời gian:</b>{" "}
                                        {new Date(updatedAt).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {userUpdate && (
                    <div className="w-full flex flex-col gap-5 h-[100px]">
                        <Label>Cập nhật bởi</Label>
                        <div className="flex-1 flex justify-start items-start gap-4">
                            <div className="h-full aspect-square ">
                                <Avatar className="h-full w-full">
                                    <AvatarImage
                                        src={`${api_media_url}${userUpdate?.userAvatar?.path}`}
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback className="bg-primary">
                                        {userUpdate?.userBase.lastname
                                            .charAt(0)
                                            .toUpperCase()}
                                        {userUpdate?.userBase.firstname
                                            .charAt(0)
                                            .toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="text-sm flex flex-col justify-between h-full">
                                <p>
                                    <b>Tên:</b> {userUpdate.userBase.lastname}{" "}
                                    {userUpdate.userBase.firstname}
                                </p>
                                <p>
                                    <b className="mr-2">Chức vụ:</b>
                                    <Badge variant="outline">
                                        {userUpdate.eRole.title}
                                    </Badge>
                                </p>
                                {updatedAt && (
                                    <p>
                                        <b>Thời gian:</b>{" "}
                                        {new Date(updatedAt).toLocaleString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
