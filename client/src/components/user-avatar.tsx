import { IUserClient } from "@/interface/user.interface";
import { api_media_url } from "@/lib/apiCall";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface IUserAvatarProps {
    user: IUserClient;
}

export default function UserAvatar({ user }: IUserAvatarProps) {
    return (
        <Avatar className="size-full ">
            <AvatarImage
                src={api_media_url + user.userBase.userAvatar?.path}
                alt="@shadcn"
            />
            <AvatarFallback>
                {user.userBase.lastname.charAt(0).toLocaleUpperCase()}
                {user.userBase.firstname.charAt(0).toLocaleUpperCase()}
            </AvatarFallback>
        </Avatar>
    );
}
