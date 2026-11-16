"use client";

import DeskBookingClient from "@/components/shared/DeskBookingClient";
import type { DeskBookingClientProps } from "@/components/shared/DeskBookingClient";

export default function StaffBookingClient(props: DeskBookingClientProps) {
    return <DeskBookingClient {...props} />;
}

export type { DeskBookingClientProps as StaffBookingClientProps };
