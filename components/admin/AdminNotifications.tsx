"use client";

import { useState, useEffect } from "react";
import { Bell, Check } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link"; // using next/link for client-side navigation

interface Notification {
    id: string;
    title: string;
    message: string;
    link?: string;
    read: boolean;
    createdAt: string;
}

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [open, setOpen] = useState(false);

    const [mounted, setMounted] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data.notifications || []);
                setUnreadCount((data.notifications || []).filter((n: Notification) => !n.read).length);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        setMounted(true);
        fetchNotifications();
        // Poll every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await fetch(`/api/notifications/${id}`, { method: "PATCH" });
            // Optimistic update
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark as read", error);
        }
    };

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-teal-400 hover:bg-white/[0.04] rounded-full w-10 h-10">
                <Bell className="size-5" />
            </Button>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative text-slate-400 hover:text-teal-400 hover:bg-white/[0.04] rounded-full w-10 h-10">
                    <Bell className="size-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 size-2.5 bg-red-500 rounded-full border-2 border-slate-900" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-80 p-0 shadow-2xl border-white/[0.08] bg-slate-900" sideOffset={8}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                    <h4 className="font-semibold text-sm text-white">Notifications</h4>
                    {unreadCount > 0 && (
                        <span className="text-xs text-teal-400 bg-teal-500/15 px-2 py-0.5 rounded-full font-medium">
                            {unreadCount} new
                        </span>
                    )}
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    {notifications.length > 0 ? (
                        <div className="divide-y divide-white/[0.04]">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={cn(
                                        "p-4 transition-premium hover:bg-white/[0.04] relative group",
                                        !notification.read ? "bg-teal-500/[0.04]" : "bg-transparent"
                                    )}
                                >
                                    <div className="flex gap-3">
                                        <div className={cn(
                                            "size-2 rounded-full mt-2 shrink-0",
                                            !notification.read ? "bg-teal-500" : "bg-slate-600"
                                        )} />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium text-white leading-none">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-slate-500 line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-slate-400">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </p>

                                            {notification.link && (
                                                <Link
                                                    href={notification.link}
                                                    className="text-xs text-teal-400 hover:underline mt-2 inline-block font-medium"
                                                    onClick={() => {
                                                        if (!notification.read) markAsRead(notification.id);
                                                        setOpen(false);
                                                    }}
                                                >
                                                    View Details
                                                </Link>
                                            )}
                                        </div>
                                        {!notification.read && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-slate-500 hover:text-teal-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => markAsRead(notification.id)}
                                                title="Mark as read"
                                            >
                                                <Check className="size-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            <Bell className="size-8 mx-auto mb-3 text-slate-600 opacity-50" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
