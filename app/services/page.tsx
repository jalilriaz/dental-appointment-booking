import prisma from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
    title: "Our Services | Elite Dental Centre",
    description: "Explore comprehensive dental services at Elite Dental Centre - implants, whitening, braces, root canal, and more with transparent PKR pricing.",
};

export default async function ServicesPage() {
    const treatments = await prisma.treatment.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
    });

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <ServicesClient treatments={treatments} />
        </div>
    );
}
