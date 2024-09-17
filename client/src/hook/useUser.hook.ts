import { UserClientContext } from "@/context/user.context";
import { useContext } from "react";

export default function useUser() {
    const user = useContext(UserClientContext);

    if (!UserClientContext) {
        throw new Error("useUser must be used within a UserProvider");
    }

    return user;
}
