import { useState } from "react";
import { Outlet } from "react-router";
import DesktopSideBar from "./Sidebar";
import MobileSideBar from "./MobileSideBar";
import Header from "./Header";
import useUIStore from "../../stores/ui.store";

const DashboardLayout = () => {

    const collapsed = useUIStore((state) => state.desktopSidebarOpen);

    return (
        <div className="min-h-screen bg-[#0A0A0C] text-[#EDEDEF]">
            <div className="flex min-h-screen">
                    <MobileSideBar />

                <aside
                    className={`hidden shrink-0 transition-all duration-300 lg:block ${
                        collapsed ? "w-20" : "w-64"
                    }`}
                >
                    <DesktopSideBar />
                </aside>

                <div className="flex min-w-0 flex-1 flex-col border-l border-[#1C1D22] w-full">
                    <header className="h-16 shrink-0 border-b border-[#1C1D22] w-full">
                        <Header />
                    </header>

                    <main className="flex-1 w-full bg-[#0A0A0C] p-6">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;