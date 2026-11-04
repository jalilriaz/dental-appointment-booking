"use client";

import { useState } from "react";
import StaffSidebar from "@/components/staff/StaffSidebar";
import Header from "@/components/admin/Header";

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            <StaffSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="lg:pl-64">
                <Header onMenuClick={() => setSidebarOpen(true)} label="Reception" />
                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
