import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Toaster } from "./components/ui/toaster";
import { router } from "./lib/react-router-dom/router";

function App() {
    return (
        <div className="w-screen h-screen bg-background overflow-hidden overflow-y-auto">
            <RouterProvider router={router} />
            <Toaster />
        </div>
    );
}

export default App;
