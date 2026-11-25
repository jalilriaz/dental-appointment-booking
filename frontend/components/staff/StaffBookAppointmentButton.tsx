"use client";

import React, { useState } from "react";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import StaffBookAppointmentModal from "./StaffBookAppointmentModal";

interface StaffBookAppointmentButtonProps {
  label?: string;
  className?: string;
}

export default function StaffBookAppointmentButton({
  label = "Book for Patient",
  className = "inline-flex items-center gap-2 px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xs transition-premium active:scale-95 cursor-pointer",
}: StaffBookAppointmentButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={className}
      >
        <CalendarTodayOutlinedIcon sx={{ fontSize: 16 }} />
        <span>{label}</span>
      </button>

      <StaffBookAppointmentModal
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
