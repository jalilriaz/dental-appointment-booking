"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50/80">
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                collapsed={collapsed}
                onToggleCollapse={() => setCollapsed(!collapsed)}
            />
            <div className={`${collapsed ? "lg:pl-20" : "lg:pl-64"} flex flex-col min-h-screen transition-all duration-300`}>
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    collapsed={collapsed}
                    onToggleCollapse={() => setCollapsed(!collapsed)}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
