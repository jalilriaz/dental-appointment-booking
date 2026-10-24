import prisma from "@/lib/prisma";
import { Metadata } from "next";
import BookClient from "./BookClient";
import type { Treatment } from "@/lib/types";

export const metadata: Metadata = {
  title: "Book an Appointment | Elite Dental Centre",
  description:
    "Schedule your dental appointment online with Elite Dental Centre. Real-time availability, instant slot booking, and zero double booking.",
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ treatment?: string }>;
}) {
  const { treatment } = await searchParams;

  const dbTreatments = await prisma.treatment.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  const treatments: Treatment[] = dbTreatments.map((t) => ({
    id: t.id,
    name: t.name,
    durationMin: t.durationMin,
    price: t.price,
    description: t.description || undefined,
    isActive: t.isActive,
    imageUrl: t.imageUrl || undefined,
  }));

  return (
    <BookClient
      treatments={treatments}
      defaultTreatmentId={treatment}
    />
  );
}
