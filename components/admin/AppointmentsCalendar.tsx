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

// Map status to a clinical light tint background color for the calendar block
const statusBackgroundColor: Record<string, string> = {
    SCHEDULED: "#eff6ff",   // Blue 50
    COMPLETED: "#f0fdf4",   // Emerald 50
    CANCELLED: "#fef2f2",   // Red 50
    NO_SHOW: "#fffbeb",     // Amber 50
    RESCHEDULED: "#f0fdfa", // Teal 50
};

const statusBorderColor: Record<string, string> = {
    SCHEDULED: "#93c5fd",   // Blue 300
    COMPLETED: "#86efac",   // Emerald 300
    CANCELLED: "#fca5a5",   // Red 300
    NO_SHOW: "#fcd34d",     // Amber 300
    RESCHEDULED: "#5eead4", // Teal 300
};

const statusTextColor: Record<string, string> = {
    SCHEDULED: "#1e40af",   // Blue 800
    COMPLETED: "#065f46",   // Emerald 800
    CANCELLED: "#991b1b",   // Red 800
    NO_SHOW: "#92400e",     // Amber 800
    RESCHEDULED: "#115e59", // Teal 800
};

export default function AppointmentsCalendar({ appointments, onEventClick }: AppointmentsCalendarProps) {
    const events = appointments.map((apt) => {
        const bg = statusBackgroundColor[apt.status] || "#f8fafc";
        const border = statusBorderColor[apt.status] || "#cbd5e1";
        const text = statusTextColor[apt.status] || "#0f172a";

        return {
            id: apt.id,
            title: `${apt.patient?.name || "Unknown"} - ${apt.treatment.name}`,
            start: apt.startTime,
            end: apt.endTime,
            backgroundColor: bg,
            borderColor: border,
            textColor: text,
            extendedProps: {
                status: apt.status,
                treatment: apt.treatment.name,
                patientPhone: apt.patient?.phone,
            },
        };
    });

    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 calendar-container overflow-hidden shadow-xs">
            <style jsx global>{`
                .calendar-container .fc {
                    --fc-page-bg-color: #ffffff;
                    --fc-neutral-bg-color: #f8fafc;
                    --fc-neutral-text-color: #475569;
                    --fc-border-color: #e2e8f0;
                    --fc-button-text-color: #334155;
                    --fc-button-bg-color: #f8fafc;
                    --fc-button-border-color: #cbd5e1;
                    --fc-button-hover-bg-color: #f1f5f9;
                    --fc-button-hover-border-color: #94a3b8;
                    --fc-button-active-bg-color: #0d9488;
                    --fc-button-active-border-color: #0d9488;
                    --fc-event-bg-color: #f8fafc;
                    --fc-event-border-color: #cbd5e1;
                    --fc-today-bg-color: #f0fdfa;
                    color: #0f172a;
                    font-family: inherit;
                }
                .calendar-container .fc-header-toolbar {
                    margin-bottom: 1rem !important;
                }
                .calendar-container .fc-toolbar-title {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: #0f172a;
                }
                .calendar-container .fc-col-header-cell {
                    padding: 0.5rem 0;
                    font-weight: 600;
                    text-transform: uppercase;
                    font-size: 0.75rem;
                    color: #475569;
                    background-color: #f8fafc;
                }
                .calendar-container .fc-daygrid-day-number {
                    color: #334155;
                    padding: 4px;
                    font-weight: 500;
                }
                .calendar-container .fc-timegrid-slot-label-cushion {
                    color: #64748b;
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                .calendar-container .fc-event {
                    border-radius: 6px;
                    padding: 2px 4px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    cursor: pointer;
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    transition: all 0.2s ease;
                }
                .calendar-container .fc-event:hover {
                    filter: brightness(0.95);
                    transform: scale(1.01);
                }
                .calendar-container .fc-timegrid-event .fc-event-main {
                    padding: 2px 4px;
                }
                .calendar-container .fc-event-time {
                    font-weight: 700;
                    margin-bottom: 2px;
                }
                .calendar-container .fc-event-title {
                    white-space: normal;
                    line-height: 1.2;
                }
            `}</style>

            <div className="bg-white rounded-lg p-2">
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
