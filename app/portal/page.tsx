import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Metadata } from "next";
import PortalClient from "./PortalClient";

export const metadata: Metadata = {
  title: "Patient Portal | Elite Dental Centre",
  description: "View your appointment history, upcoming dental visits, and clinical records.",
};

export default async function PortalPage() {
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    redirect("/login?callbackUrl=/portal");
  }

  let session;
  try {
    session = await decrypt(cookie);
  } catch {
    redirect("/login?callbackUrl=/portal");
  }

  if (!session || !session.id) {
    redirect("/login?callbackUrl=/portal");
  }

  // Fetch the patient user with their appointments
  const user = await prisma.user.findUnique({
    where: { id: session.id as string },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      patientCode: true,
      dateOfBirth: true,
      appointments: {
        include: {
          treatment: {
            select: {
              id: true,
              name: true,
              durationMin: true,
              price: true,
              category: true,
            },
          },
          clinicalNotes: {
            select: {
              id: true,
              diagnosis: true,
              treatmentDone: true,
              prescription: true,
              remarks: true,
            },
          },
          payments: {
            select: {
              id: true,
              amount: true,
              method: true,
              date: true,
            },
          },
        },
        orderBy: { startTime: "desc" },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }

  const serializedUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    patientCode: user.patientCode,
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
  };

  const serializedAppointments = user.appointments.map((a) => ({
    id: a.id,
    startTime: a.startTime.toISOString(),
    endTime: a.endTime.toISOString(),
    status: a.status,
    price: a.price,
    amountPaid: a.amountPaid,
    notes: a.notes,
    bookedBy: a.bookedBy,
    treatment: a.treatment,
    clinicalNotes: a.clinicalNotes,
    payments: a.payments.map((p) => ({
      ...p,
      date: p.date.toISOString(),
    })),
  }));

  return (
    <PortalClient
      user={serializedUser}
      appointments={serializedAppointments}
    />
  );
}
