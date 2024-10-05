import { SocketContext } from "@/context/socket.context";
import { useContext } from "react";

export default function useSocket() {
    const context = useContext(SocketContext);
    return context;
}
