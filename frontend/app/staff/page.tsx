import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import NuraReceptionDashboard from "@/components/staff/NuraReceptionDashboard";
import { subDays, startOfDay, endOfDay, format } from "date-fns";

async function getSession() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) return null;
  try {
    return await decrypt(cookie);
  } catch {
    return null;
  }
}

export default async function StaffDashboard() {
  const session = await getSession();
  if (!session) redirect("/login");

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(todayStart.getTime() + 86400000);
  const tomorrowStart = new Date(todayEnd);
  const tomorrowEnd = new Date(tomorrowStart.getTime() + 86400000);
  const sevenDaysAgo = subDays(todayStart, 6);

  const [
    todayAppointments,
    tomorrowAppointments,
    todayCompleted,
    totalPatients,
    pastWeekAppointments,
    allCompletedCount,
    allNoShowCount,
    doctors,
  ] = await Promise.all([
    prisma.appointment.findMany({
      where: { startTime: { gte: todayStart, lt: todayEnd }, status: { not: "CANCELLED" } },
      include: {
        patient: { select: { id: true, name: true, phone: true, email: true, medicalAlerts: true } },
        treatment: { select: { name: true, durationMin: true, price: true } },
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.appointment.findMany({
      where: { startTime: { gte: tomorrowStart, lt: tomorrowEnd }, status: { not: "CANCELLED" } },
      include: {
        patient: { select: { id: true, name: true, phone: true } },
        treatment: { select: { name: true, durationMin: true, price: true } },
      },
      orderBy: { startTime: "asc" },
    }),
    prisma.appointment.count({
      where: { startTime: { gte: todayStart, lt: todayEnd }, status: "COMPLETED" },
    }),
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.appointment.findMany({
      where: { startTime: { gte: sevenDaysAgo, lte: todayEnd } },
      select: { startTime: true, status: true },
    }),
    prisma.appointment.count({ where: { status: "COMPLETED" } }),
    prisma.appointment.count({ where: { status: "NO_SHOW" } }),
    prisma.doctor.findMany({
      where: { isActive: true },
      orderBy: [{ isLead: "desc" }, { createdAt: "asc" }],
      select: {
        id: true,
        name: true,
        role: true,
        operatory: true,
        schedule: true,
        isLead: true,
        image: true,
      },
    }),
  ]);

  const todayTotal = todayAppointments.length;
  const remainingToday = todayAppointments.filter(
    (a) => new Date(a.startTime) >= now && a.status === "SCHEDULED"
  ).length;
  const tomorrowTotal = tomorrowAppointments.length;

  // Calculate Attendance Reliability Rate (Benchmark Index)
  const totalAttendedOrMissed = allCompletedCount + allNoShowCount;
  const attendanceRate = totalAttendedOrMissed > 0
    ? Math.round((allCompletedCount / totalAttendedOrMissed) * 100)
    : 94;

  // 1. Calculate 7-Day Trend Curve for Recharts Wave
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyTrendMap: Record<string, { count: number; completed: number }> = {};

  for (let i = 6; i >= 0; i--) {
    const d = subDays(now, i);
    const dayLabel = format(d, "EEE");
    weeklyTrendMap[dayLabel] = { count: 0, completed: 0 };
  }

  for (const apt of pastWeekAppointments) {
    const dayLabel = format(new Date(apt.startTime), "EEE");
    if (weeklyTrendMap[dayLabel]) {
      weeklyTrendMap[dayLabel].count += 1;
      if (apt.status === "COMPLETED") {
        weeklyTrendMap[dayLabel].completed += 1;
      }
    }
  }

  const weeklyTrend = Object.keys(weeklyTrendMap).map((day) => ({
    day,
    count: weeklyTrendMap[day].count || 1, // baseline fallback so curve renders smoothly
    completed: weeklyTrendMap[day].completed,
  }));

  // 2. Calculate Hourly Distribution Across Today's Shift (12 PM to 8 PM)
  const hours = ["12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM", "6 PM", "7 PM"];
  const hourlyCountMap: Record<string, number> = {
    "12 PM": 0, "1 PM": 0, "2 PM": 0, "3 PM": 0, "4 PM": 0, "5 PM": 0, "6 PM": 0, "7 PM": 0,
  };

  for (const apt of todayAppointments) {
    const hourNum = new Date(apt.startTime).getHours();
    if (hourNum >= 12 && hourNum <= 19) {
      const label = hourNum === 12 ? "12 PM" : `${hourNum - 12} PM`;
      if (hourlyCountMap[label] !== undefined) {
        hourlyCountMap[label] += 1;
      }
    }
  }

  const hourlyDistribution = hours.map((hour) => ({
    hour,
    count: hourlyCountMap[hour] || 0,
    active: hourlyCountMap[hour] > 0,
  }));

  // 3. Serialize data for client component
  const serializedToday = todayAppointments.map((a) => ({
    id: a.id,
    startTime: a.startTime.toISOString(),
    endTime: a.endTime.toISOString(),
    status: a.status,
    amountPaid: a.amountPaid || 0,
    price: a.price || a.treatment.price,
    patient: a.patient,
    treatment: a.treatment,
  }));

  const serializedTomorrow = tomorrowAppointments.map((a) => ({
    id: a.id,
    startTime: a.startTime.toISOString(),
    endTime: a.endTime.toISOString(),
    status: a.status,
    amountPaid: a.amountPaid || 0,
    price: a.price || a.treatment.price,
    patient: a.patient,
    treatment: a.treatment,
  }));

  return (
    <NuraReceptionDashboard
      todayTotal={todayTotal}
      remainingToday={remainingToday}
      todayCompleted={todayCompleted}
      tomorrowTotal={tomorrowTotal}
      totalPatients={totalPatients}
      attendanceRate={attendanceRate}
      todayAppointments={serializedToday}
      tomorrowAppointments={serializedTomorrow}
      weeklyTrend={weeklyTrend}
      hourlyDistribution={hourlyDistribution}
      doctors={doctors}
    />
  );
}
