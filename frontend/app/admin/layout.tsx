"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50/80">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            <div className="lg:pl-64 flex flex-col min-h-screen">
                <Header onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
