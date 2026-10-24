"use server"

import prisma from "@/lib/prisma";
import { format, startOfDay, endOfDay, startOfYear, subMonths } from "date-fns";

export async function getRevenueData(dateRange: string, customStartStr?: string, customEndStr?: string) {
  const today = new Date();
  let startDate: Date | undefined;
  let endDate = endOfDay(today);

  if (dateRange === "thisMonth") {
    startDate = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (dateRange === "last12Months") {
    startDate = subMonths(today, 12);
  } else if (dateRange === "thisYear") {
    startDate = startOfYear(today);
  } else if (dateRange === "custom" && customStartStr && customEndStr) {
    startDate = startOfDay(new Date(customStartStr));
    endDate = endOfDay(new Date(customEndStr));
  } else if (dateRange === "allTime") {
    startDate = undefined; // Null start date fetches everything up to endDate
  } else {
    // Default: Last 6 Months
    startDate = subMonths(today, 6);
  }

  const dateFilter = startDate ? { gte: startDate, lte: endDate } : { lte: endDate };

  // 1. Fetch Completed Appointments
  const appointments = await prisma.appointment.findMany({
    where: {
      status: "COMPLETED",
      startTime: dateFilter,
    },
    include: {
      treatment: {
        select: {
          name: true,
          price: true,
          category: true,
        },
      },
      patient: {
        select: { name: true }
      }
    },
    orderBy: { startTime: "asc" }
  });

  // 2. Fetch Installments (strictly standalone payments to prevent double counting with appointment checkouts)
  const payments = await prisma.payment.findMany({
    where: {
      date: dateFilter,
      appointmentId: null // CRITICAL: Only count manual installments here
    },
    include: {
      patientTreatment: {
        include: { treatment: { select: { name: true } } }
      }
    }
  });

  // 3. Fetch Scheduled (for Projected, always all-time upcoming)
  const scheduledAppointments = await prisma.appointment.findMany({
    where: { status: "SCHEDULED" },
    include: {
      treatment: { select: { price: true } },
    },
  });

  const projectedFromScheduled = scheduledAppointments.reduce((sum, a) => sum + (a.price || a.treatment.price), 0);

  // 4. Summaries
  const filteredAptRevenue = appointments.reduce((sum, a) => sum + (a.amountPaid ?? 0), 0);
  const filteredInstallmentRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const filteredTotal = filteredAptRevenue + filteredInstallmentRevenue;
  const filteredDiscount = appointments.reduce((sum, a) => sum + (a.discount ?? 0), 0);
  const filteredAvg = appointments.length > 0 ? Math.round(filteredAptRevenue / appointments.length) : 0;

  // 5. Chart Data Processing
  const monthlyDataMap: Record<string, any> = {};
  const activeServices = new Set<string>();
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const busiestDaysMap: Record<string, number> = {
    Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0 
  };
  const serviceMap = new Map<string, { revenue: number; count: number }>();

  // Process standard appointment checkouts
  appointments.forEach((apt) => {
    const amount = apt.amountPaid || 0;
    const serviceName = apt.treatment.name;
    activeServices.add(serviceName);
    
    // Monthly Stacked Bar
    const monthKey = format(apt.startTime, "MMM yyyy");
    if (!monthlyDataMap[monthKey]) {
      monthlyDataMap[monthKey] = {
        name: monthKey,
        total: 0,
        servicesBreakdown: {},
      };
    }
    
    // Add amount to the specific service and total
    monthlyDataMap[monthKey][serviceName] = (monthlyDataMap[monthKey][serviceName] || 0) + amount;
    monthlyDataMap[monthKey].total += amount;
    monthlyDataMap[monthKey].servicesBreakdown[serviceName] = (monthlyDataMap[monthKey].servicesBreakdown[serviceName] || 0) + amount;

    // Busiest Days
    const dayName = daysOfWeek[apt.startTime.getDay()];
    busiestDaysMap[dayName] += amount;

    // Service Breakdown
    const serviceExisting = serviceMap.get(serviceName) || { revenue: 0, count: 0 };
    serviceExisting.revenue += amount;
    serviceExisting.count += 1;
    serviceMap.set(serviceName, serviceExisting);
  });

  // Process standalone manual installments
  payments.forEach((payment) => {
    const amount = payment.amount;
    const serviceName = payment.patientTreatment.treatment.name;
    activeServices.add(serviceName);
    
    const monthKey = format(payment.date, "MMM yyyy");
    if (!monthlyDataMap[monthKey]) {
      monthlyDataMap[monthKey] = {
        name: monthKey,
        total: 0,
        servicesBreakdown: {},
      };
    }
    
    monthlyDataMap[monthKey][serviceName] = (monthlyDataMap[monthKey][serviceName] || 0) + amount;
    monthlyDataMap[monthKey].total += amount;
    monthlyDataMap[monthKey].servicesBreakdown[serviceName] = (monthlyDataMap[monthKey].servicesBreakdown[serviceName] || 0) + amount;

    const dayName = daysOfWeek[payment.date.getDay()];
    busiestDaysMap[dayName] += amount;

    const serviceExisting = serviceMap.get(serviceName) || { revenue: 0, count: 0 };
    serviceExisting.revenue += amount;
    serviceExisting.count += 1; // Count as an interaction/payment instance
    serviceMap.set(serviceName, serviceExisting);
  });

  // Convert for charts
  const monthlyChartData = Object.values(monthlyDataMap).sort((a: any, b: any) => {
    return new Date(a.name).getTime() - new Date(b.name).getTime();
  });
  
  const busiestDaysData = Object.entries(busiestDaysMap)
    .map(([day, revenue]) => ({ day, revenue }))
    .filter(item => item.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue);

  const serviceBreakdown = Array.from(serviceMap.entries())
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.revenue - a.revenue);

  const rawDataForExport = appointments.map(apt => ({
    Date: format(apt.startTime, "yyyy-MM-dd HH:mm"),
    Patient: apt.patient?.name || "Unknown",
    Service: apt.treatment.name,
    Category: apt.treatment.category || "General",
    AmountPaid: apt.amountPaid,
    Discount: apt.discount
  }));

  const serializedAppointments = appointments.map(a => ({
    id: a.id,
    startTime: a.startTime.toISOString(),
    amountPaid: a.amountPaid ?? 0,
    discount: a.discount ?? 0,
    patient: { name: a.patient?.name || "Unknown" },
    treatment: { name: a.treatment.name }
  })).reverse();

  // Sort the active services by their total revenue (highest earner first)
  const categoriesList = Array.from(activeServices).sort((a, b) => {
    const sumA = serviceBreakdown.find(s => s.name === a)?.revenue || 0;
    const sumB = serviceBreakdown.find(s => s.name === b)?.revenue || 0;
    return sumB - sumA;
  });

  return {
    summaries: {
      filteredTotal,
      filteredAptRevenue,
      filteredInstallmentRevenue,
      filteredDiscount,
      filteredAvg,
      projectedFromScheduled,
      scheduledCount: scheduledAppointments.length,
      appointmentsCount: appointments.length,
    },
    monthlyChartData,
    busiestDaysData,
    serviceBreakdown,
    rawDataForExport,
    serializedAppointments,
    categoriesList,
  };
}
