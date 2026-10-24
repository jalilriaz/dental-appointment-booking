"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import type { Appointment } from "@/lib/types";
import { statusColors } from "@/lib/utils";

interface AppointmentsCalendarProps {
    appointments: Appointment[];
    onEventClick: (appointmentId: string) => void;
}

// Map status to a darker background color for the calendar block
const statusBackgroundColor: Record<string, string> = {
    SCHEDULED: "#0f172a", // Slate 900
    COMPLETED: "#064e3b", // Emerald 900
    CANCELLED: "#450a0a", // Red 900
    NO_SHOW: "#451a03",   // Amber 900
    RESCHEDULED: "#1e3a8a", // Blue 900
};

const statusBorderColor: Record<string, string> = {
    SCHEDULED: "#3b82f6", // Blue 500
    COMPLETED: "#10b981", // Emerald 500
    CANCELLED: "#ef4444", // Red 500
    NO_SHOW: "#f59e0b",   // Amber 500
    RESCHEDULED: "#3b82f6", // Blue 500
};

export default function AppointmentsCalendar({ appointments, onEventClick }: AppointmentsCalendarProps) {
    const events = appointments.map((apt) => {
        const bg = statusBackgroundColor[apt.status] || "#1e293b";
        const border = statusBorderColor[apt.status] || "#475569";

        return {
            id: apt.id,
            title: `${apt.patient?.name || "Unknown"} - ${apt.treatment.name}`,
            start: apt.startTime,
            end: apt.endTime,
            backgroundColor: bg,
            borderColor: border,
            textColor: "#f8fafc",
            extendedProps: {
                status: apt.status,
                treatment: apt.treatment.name,
                patientPhone: apt.patient?.phone,
            },
        };
    });

    return (
        <div className="glass-card rounded-xl p-4 calendar-container overflow-hidden">
            <style jsx global>{`
                .calendar-container .fc {
                    --fc-page-bg-color: transparent;
                    --fc-neutral-bg-color: rgba(255, 255, 255, 0.02);
                    --fc-neutral-text-color: #94a3b8;
                    --fc-border-color: rgba(255, 255, 255, 0.06);
                    --fc-button-text-color: #e2e8f0;
                    --fc-button-bg-color: rgba(255, 255, 255, 0.04);
                    --fc-button-border-color: rgba(255, 255, 255, 0.1);
                    --fc-button-hover-bg-color: rgba(255, 255, 255, 0.1);
                    --fc-button-hover-border-color: rgba(255, 255, 255, 0.2);
                    --fc-button-active-bg-color: rgba(20, 184, 166, 0.2);
                    --fc-button-active-border-color: #14b8a6;
                    --fc-event-bg-color: #0f172a;
                    --fc-event-border-color: #3b82f6;
                    --fc-today-bg-color: rgba(20, 184, 166, 0.05);
                    color: #f8fafc;
                    font-family: inherit;
                }
                .calendar-container .fc-header-toolbar {
                    margin-bottom: 1rem !important;
                }
                .calendar-container .fc-toolbar-title {
                    font-size: 1.25rem;
                    font-weight: 600;
                    color: #f8fafc;
                }
                .calendar-container .fc-col-header-cell {
                    padding: 0.5rem 0;
                    font-weight: 500;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    color: #94a3b8;
                }
                .calendar-container .fc-daygrid-day-number {
                    color: #cbd5e1;
                    padding: 4px;
                }
                .calendar-container .fc-timegrid-slot-label-cushion {
                    color: #94a3b8;
                    font-size: 0.75rem;
                }
                .calendar-container .fc-event {
                    border-radius: 4px;
                    padding: 2px 4px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                .calendar-container .fc-event:hover {
                    filter: brightness(1.2);
                    transform: scale(1.02);
                }
                .calendar-container .fc-timegrid-event .fc-event-main {
                    padding: 2px 4px;
                }
                .calendar-container .fc-event-time {
                    font-weight: 600;
                    margin-bottom: 2px;
                }
                .calendar-container .fc-event-title {
                    white-space: normal;
                    line-height: 1.2;
                }
            `}</style>

            <div className="bg-slate-900/50 rounded-lg p-2">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    allDaySlot={false}
                    slotMinTime="08:00:00"
                    slotMaxTime="22:00:00"
                    events={events}
                    eventClick={(info) => {
                        onEventClick(info.event.id);
                    }}
                    height="auto"
                    contentHeight={700}
                    nowIndicator={true}
                    slotDuration="00:30:00"
                    slotLabelInterval="01:00"
                    expandRows={true}
                    stickyHeaderDates={true}
                />
            </div>
        </div>
    );
}
