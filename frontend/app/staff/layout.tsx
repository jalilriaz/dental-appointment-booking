"use client";

import { useState } from "react";
import StaffSidebar from "@/components/staff/StaffSidebar";
import Header from "@/components/admin/Header";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[#F1F5F9]">
            <StaffSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="lg:pl-64 flex flex-col min-h-screen min-w-0">
                <Header onMenuClick={() => setSidebarOpen(true)} label="Reception" />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full min-w-0">
                    {children}
                </main>
            </div>
        </div>
    );
}
