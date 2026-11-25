import type { ReceiptData } from "@/components/admin/ReceiptDialog";
import { formatDate, formatTime } from "@/lib/utils";

export interface ReceiptSourceAppointment {
  id: string;
  startTime: string;
  price?: number | null;
  discount?: number | null;
  amountPaid?: number | null;
  paymentMethod?: string;
  guestName?: string | null;
  guestPhone?: string | null;
  sessionNumber?: number | null;
  patient: {
    id?: string;
    name: string | null;
    phone?: string | null;
    patientCode?: number | null;
    dateOfBirth?: string | Date | null;
    gender?: string | null;
  } | null;
  treatment: {
    name: string;
    price: number;
  };
  doctor?: {
    name?: string | null;
  } | null;
  patientTreatment?: {
    totalCost: number;
    totalSessions: number;
    payments?: { date?: string; method?: string; amount: number }[];
  } | null;
}

/**
 * Normalizes an appointment (and optional active checkout details) into `ReceiptData`.
 */
export function buildAppointmentReceiptData(apt: ReceiptSourceAppointment): ReceiptData {
  const effectivePrice = apt.price ?? apt.treatment.price;
  const treatmentPrice = apt.patientTreatment?.totalCost || effectivePrice;
  const discount = apt.discount || 0;
  const amountPaid = apt.amountPaid || 0;

  const planPayments = apt.patientTreatment?.payments || [];
  const totalPaidForPlan =
    planPayments.length > 0
      ? planPayments.reduce((sum, p) => sum + p.amount, 0)
      : amountPaid;

  const remainingBalance = apt.patientTreatment
    ? Math.max(0, apt.patientTreatment.totalCost - totalPaidForPlan)
    : Math.max(0, effectivePrice - discount - amountPaid);

  const payments =
    planPayments.length > 0
      ? planPayments.map((p) => ({
          date: p.date || apt.startTime,
          method: p.method || apt.paymentMethod || "CASH",
          amount: p.amount,
        }))
      : amountPaid > 0
        ? [
            {
              date: apt.startTime,
              method: apt.paymentMethod || "CASH",
              amount: amountPaid,
            },
          ]
        : [];

  return {
    patientName: apt.guestName || apt.patient?.name || "Unknown Patient",
    patientPhone: apt.guestPhone || apt.patient?.phone || undefined,
    patientId: apt.patient?.id,
    patientCode: apt.patient?.patientCode,
    patientAge: apt.patient?.dateOfBirth
      ? `${new Date().getFullYear() - new Date(apt.patient.dateOfBirth).getFullYear()} Y`
      : undefined,
    patientGender: apt.patient?.gender,
    treatmentName: apt.treatment.name,
    appointmentDate: formatDate(apt.startTime),
    appointmentTime: formatTime(apt.startTime),
    treatmentPrice,
    discount,
    discountPercent:
      discount > 0 && effectivePrice > 0
        ? Math.round((discount / effectivePrice) * 100)
        : undefined,
    amountPaid,
    remainingBalance,
    paymentMethod: apt.paymentMethod,
    sessionNumber: apt.sessionNumber,
    totalSessions: apt.patientTreatment?.totalSessions,
    payments,
    doctorName: apt.doctor?.name || undefined,
    recordedBy: apt.doctor?.name || "Dr. Shehryar Akhtar",
  };
}
