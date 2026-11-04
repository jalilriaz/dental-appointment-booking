"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
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
                        "group relative inline-flex items-center gap-2.5 rounded-lg border text-left text-sm font-medium transition-all duration-200",
                        "bg-white/[0.04] border-white/[0.08] text-white",
                        "hover:bg-white/[0.07] hover:border-teal-500/30",
                        "focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/20",
                        "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white/[0.04] disabled:hover:border-white/[0.08]",
                        compact
                            ? "h-9 px-3 min-w-[140px]"
                            : "h-11 px-4 min-w-[200px]",
                        className
                    )}
                >
                    <CalendarIcon className={cn(
                        "shrink-0 transition-colors duration-200",
                        compact ? "size-3.5" : "size-4",
                        value ? "text-teal-400" : "text-slate-500 group-hover:text-slate-400"
                    )} />
                    <span className={cn(
                        "flex-1 truncate",
                        !value && "text-slate-500"
                    )}>
                        {selectedDate
                            ? format(selectedDate, compact ? "MMM d, yyyy" : "EEEE, MMM d, yyyy")
                            : placeholder}
                    </span>
                    {value && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 size-1.5 rounded-full bg-teal-400 animate-pulse" />
                    )}
                </button>
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    "w-auto p-0 border-0 bg-transparent shadow-none",
                )}
                align="start"
                sideOffset={8}
            >
                <div className="rounded-xl border border-white/[0.08] bg-slate-900/95 backdrop-blur-xl shadow-2xl shadow-black/40 overflow-hidden">
                    {/* Calendar Header */}
                    <div className="px-4 pt-3 pb-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <CalendarIcon className="size-3" />
                            <span>Select a date</span>
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
                            caption_label: "text-sm font-semibold text-white tracking-wide",
                            nav: "flex items-center gap-1 absolute inset-x-0 top-0 justify-between px-1",
                            button_previous: "size-8 inline-flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/20 transition-all duration-200",
                            button_next: "size-8 inline-flex items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/20 transition-all duration-200",
                            weekdays: "flex",
                            weekday: "text-slate-500 w-9 font-medium text-[0.7rem] uppercase tracking-wider",
                            week: "flex mt-1",
                            day: "relative p-0 text-center focus-within:z-20",
                            today: "date-picker-today",
                            outside: "text-slate-600/50 aria-selected:text-white",
                            disabled: "text-slate-700 opacity-40 cursor-not-allowed line-through",
                            hidden: "invisible",
                            range_start: "rounded-l-lg bg-teal-500/20",
                            range_end: "rounded-r-lg bg-teal-500/20",
                            range_middle: "bg-teal-500/10",
                        }}
                        components={{
                            Chevron: ({ orientation, ...props }) => {
                                if (orientation === "left") {
                                    return <ChevronLeft className="size-4" {...props} />
                                }
                                return <ChevronRight className="size-4" {...props} />
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
                                            "relative size-9 rounded-lg text-sm font-medium transition-all duration-150",
                                            "focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:ring-offset-1 focus:ring-offset-slate-900",
                                            isSelected
                                                ? "bg-gradient-to-br from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/25 scale-105 font-bold"
                                                : isToday
                                                    ? "bg-teal-500/10 text-teal-400 border border-teal-500/30 font-semibold"
                                                    : isOutside
                                                        ? "text-slate-600/50 hover:text-slate-400 hover:bg-white/[0.03]"
                                                        : isDisabled
                                                            ? "text-slate-700 cursor-not-allowed"
                                                            : "text-slate-300 hover:bg-teal-500/10 hover:text-teal-300 hover:scale-105 active:scale-95",
                                        )}
                                        {...props}
                                    />
                                )
                            },
                        }}
                    />

                    {/* Footer */}
                    {selectedDate && (
                        <div className="px-4 pb-3 pt-1 border-t border-white/[0.04]">
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-slate-500">
                                    Selected: <span className="text-teal-400 font-medium">{format(selectedDate, "EEEE, MMM d, yyyy")}</span>
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        onChange("")
                                        setOpen(false)
                                    }}
                                    className="text-[10px] text-slate-500 hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-500/10"
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
