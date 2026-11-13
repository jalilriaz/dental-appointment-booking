"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import ChevronLeftOutlinedIcon from "@mui/icons-material/ChevronLeftOutlined";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import { type Matcher } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
    value: string // "YYYY-MM-DD" or ""
    onChange: (val: string) => void
    min?: string // "YYYY-MM-DD"
    max?: string // "YYYY-MM-DD"
    placeholder?: string
    disabled?: boolean
    disabledDays?: (date: Date) => boolean
    className?: string
    id?: string
    /** Compact mode for filter-style pickers */
    compact?: boolean
}

function parseDate(str: string): Date | undefined {
    if (!str) return undefined
    const d = parse(str, "yyyy-MM-dd", new Date())
    return isValid(d) ? d : undefined
}

function formatToISO(date: Date): string {
    return format(date, "yyyy-MM-dd")
}

export function DatePicker({
    value,
    onChange,
    min,
    max,
    placeholder = "Pick a date",
    disabled = false,
    disabledDays,
    className,
    id,
    compact = false,
}: DatePickerProps) {
    const [open, setOpen] = React.useState(false)

    const selectedDate = parseDate(value)
    const minDate = min ? parseDate(min) : undefined
    const maxDate = max ? parseDate(max) : undefined

    // Build disabled matcher for react-day-picker
    const disabledMatcher = React.useMemo(() => {
        const matchers: Matcher[] = []
        if (minDate) matchers.push({ before: minDate })
        if (maxDate) matchers.push({ after: maxDate })
        if (disabledDays) matchers.push(disabledDays)
        return matchers
    }, [minDate, maxDate, disabledDays])

    const handleSelect = (date: Date | undefined) => {
        if (date) {
            onChange(formatToISO(date))
            setOpen(false)
        }
    }

    // Determine which month to show when opening
    const defaultMonth = selectedDate || minDate || new Date()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <button
                    id={id}
                    type="button"
                    disabled={disabled}
                    className={cn(
                        "group relative inline-flex items-center gap-2.5 border text-left text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer",
                        "bg-white border-slate-200/90 text-slate-900 shadow-2xs",
                        "hover:bg-slate-50/80 hover:border-teal-400 hover:text-slate-900",
                        "focus:outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-500/10",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
                        compact
                            ? "h-9 px-3 min-w-[130px] rounded-xl text-xs"
                            : "h-11 px-4 min-w-[200px] w-full rounded-2xl",
                        className
                    )}
                >
                    <CalendarTodayOutlinedIcon className={cn(
                        "shrink-0 transition-colors duration-200",
                        compact ? "size-3.5" : "size-4",
                        value ? "text-teal-600" : "text-slate-400 group-hover:text-teal-600"
                    )} />
                    <span className={cn(
                        "flex-1 truncate",
                        value ? "text-slate-900 font-bold" : "text-slate-400 font-medium"
                    )}>
                        {selectedDate
                            ? format(selectedDate, compact ? "MMM d, yyyy" : "EEEE, MMMM d, yyyy")
                            : placeholder}
                    </span>
                    {value && (
                        <span className="size-2 rounded-full bg-teal-500 shrink-0 shadow-2xs" />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    "w-auto p-0 border-0 bg-transparent shadow-none z-50",
                )}
                align="start"
                sideOffset={8}
            >
                <div className="rounded-2xl border border-slate-800 bg-[#0B1528] text-white shadow-2xl shadow-black/50 overflow-hidden font-sans">
                    {/* Calendar Header */}
                    <div className="px-4 pt-3 pb-1.5 border-b border-white/[0.06]">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <CalendarTodayOutlinedIcon className="size-3 text-teal-400" />
                            <span className="font-semibold text-slate-300">Select appointment date</span>
                        </div>
                    </div>

                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleSelect}
                        defaultMonth={defaultMonth}
                        disabled={disabledMatcher}
                        showOutsideDays={true}
                        className="date-picker-calendar"
                        classNames={{
                            root: "p-3",
                            months: "flex flex-col",
                            month: "space-y-3",
                            month_caption: "flex justify-center items-center h-8 relative",
                            caption_label: "text-sm font-extrabold text-white tracking-wide",
                            nav: "flex items-center gap-1 absolute inset-x-0 top-0 justify-between px-1",
                            button_previous: "size-8 inline-flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:bg-teal-500/20 hover:text-teal-300 hover:border-teal-400/40 transition-all duration-200 cursor-pointer",
                            button_next: "size-8 inline-flex items-center justify-center rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:bg-teal-500/20 hover:text-teal-300 hover:border-teal-400/40 transition-all duration-200 cursor-pointer",
                            weekdays: "flex",
                            weekday: "text-slate-400 w-9 font-bold text-[0.7rem] uppercase tracking-wider text-center",
                            week: "flex mt-1",
                            day: "relative p-0 text-center focus-within:z-20",
                            today: "date-picker-today",
                            outside: "text-slate-600 aria-selected:text-white",
                            disabled: "text-slate-600 opacity-40 cursor-not-allowed line-through",
                            hidden: "invisible",
                            range_start: "rounded-l-xl bg-teal-500/20",
                            range_end: "rounded-r-xl bg-teal-500/20",
                            range_middle: "bg-teal-500/10",
                        }}
                        components={{
                            Chevron: ({ orientation, ...props }) => {
                                if (orientation === "left") {
                                    return <ChevronLeftOutlinedIcon className="size-4" {...props} />
                                }
                                return <ChevronRightOutlinedIcon className="size-4" {...props} />
                            },
                            DayButton: ({ day, modifiers, className: dayClassName, ...props }) => {
                                const isSelected = modifiers.selected
                                const isToday = modifiers.today
                                const isDisabled = modifiers.disabled
                                const isOutside = modifiers.outside

                                return (
                                    <button
                                        type="button"
                                        disabled={isDisabled}
                                        className={cn(
                                            "relative size-9 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center mx-auto",
                                            "focus:outline-none focus:ring-2 focus:ring-teal-400/50",
                                            isSelected
                                                ? "bg-teal-600 text-white shadow-lg shadow-teal-500/30 scale-105 font-black"
                                                : isToday
                                                    ? "bg-teal-500/15 text-teal-300 border border-teal-400/40 font-bold"
                                                    : isOutside
                                                        ? "text-slate-600 hover:text-slate-400 hover:bg-white/[0.04]"
                                                        : isDisabled
                                                            ? "text-slate-600 cursor-not-allowed opacity-40"
                                                            : "text-slate-200 hover:bg-teal-500/15 hover:text-teal-200 hover:scale-105 active:scale-95",
                                        )}
                                        {...props}
                                    />
                                )
                            },
                        }}
                    />

                    {/* Footer */}
                    {selectedDate && (
                        <div className="px-4 pb-3 pt-2 border-t border-white/[0.06]">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-400">
                                    Selected: <span className="text-teal-300 font-bold">{format(selectedDate, "EEE, MMM d, yyyy")}</span>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange("")
                                        setOpen(false)
                                    }}
                                    className="text-[11px] text-slate-400 hover:text-red-400 transition-colors px-2 py-0.5 rounded-lg hover:bg-red-500/10 cursor-pointer font-bold"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
