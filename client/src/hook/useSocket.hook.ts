"use client";

import { api_base_url } from "@/lib/apiCall";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export default function useSocket() {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    useEffect(() => {
        const socketInstance = io(api_base_url);
        setSocket(socketInstance);

        socketInstance.on("connect", () => {
            setIsConnected(true);
            console.log("Socket connected");
        });

        socketInstance.on("disconnect", (reason) => {
            setIsConnected(false);
            console.log("Socket disconnected:", reason);
            if (reason === "io server disconnect") {
                socketInstance.connect();
            }
        });

        socketInstance.on("connect_error", (error) => {
            setIsConnected(false);
            console.log("Connection error:", error);
        });

        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, []);

    return { socket, isConnected };
}
