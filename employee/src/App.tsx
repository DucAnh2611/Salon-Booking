import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Toaster as Sonner } from "./components/ui/sonner";
import { Toaster } from "./components/ui/toaster";
import SocketProvider from "./context/socket.context";
import { router } from "./lib/react-router-dom/router";

function App() {
    return (
        <div className="w-screen h-screen bg-background overflow-hidden overflow-y-auto">
            <SocketProvider>
                <RouterProvider router={router} />
                <Toaster />
                <Sonner />
            </SocketProvider>
        </div>
    );
}

export default App;
