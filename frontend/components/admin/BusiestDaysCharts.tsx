"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell
} from 'recharts';

interface BusiestDaysData {
    dayOfWeekData: { name: string, total: number }[];
    dayOfMonthData: { name: string, total: number }[];
}

export function BusiestDaysCharts({ data }: { data: BusiestDaysData }) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
            <Card className="glass-card border-white/[0.06]">
                <CardHeader>
                    <CardTitle>Busiest Days of the Week</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data.dayOfWeekData}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)' }}
                                itemStyle={{ color: '#14b8a6' }}
                                labelStyle={{ color: '#e2e8f0' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="total" name="Appointments" radius={[4, 4, 0, 0]}>
                                {data.dayOfWeekData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.total > 0 ? "#14b8a6" : "#334155"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card className="glass-card border-white/[0.06]">
                <CardHeader>
                    <CardTitle>Busiest Days of the Month</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={data.dayOfMonthData}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.3)' }}
                                itemStyle={{ color: '#3b82f6' }}
                                labelStyle={{ color: '#e2e8f0' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="total" name="Appointments" radius={[4, 4, 0, 0]}>
                                {data.dayOfMonthData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.total > 0 ? "#3b82f6" : "#334155"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}
