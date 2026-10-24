import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { clinicInfo, teamMembers } from "@/app/constants/mockData";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
    title: "About Us | Elite Dental Centre",
    description:
        "Learn about Elite Dental Centre — Islamabad's trusted dental clinic combining advanced technology with patient-first care for healthy, confident smiles.",
};

const expertiseAreas = [
    {
        iconKey: "stethoscope" as const,
        title: "General Dentistry",
        desc: "Comprehensive checkups, cleaning, and preventive oral care",
    },
    {
        iconKey: "sparkles" as const,
        title: "Cosmetic Dentistry",
        desc: "Teeth whitening, smile design, and veneers for a stunning smile",
    },
    {
        iconKey: "wrench" as const,
        title: "Restorative Treatments",
        desc: "Fillings, crowns, implants, and root canal therapy",
    },
    {
        iconKey: "shield-check" as const,
        title: "Preventive Care",
        desc: "Long-term oral health strategies and regular maintenance",
    },
];

const whyChooseItems = [
    "Patient-centered care with personalized treatment plans",
    "Modern equipment & sterilization standards",
    "Comfortable and stress-free environment",
    "Transparent communication & honest advice",
];

const milestones = [
    { year: "2014", title: "Clinic Founded", desc: "Elite Dental Centre opened its doors to serve the community" },
    { year: "2016", title: "Digital X-Ray Upgrade", desc: "Invested in modern digital radiography - 90% less radiation" },
    { year: "2019", title: "5,000+ Happy Patients", desc: "Reached a milestone of trusted patient relationships" },
    { year: "2022", title: "Advanced Implant System", desc: "Introduced German-engineered dental implant technology" },
    { year: "2024", title: "Online Booking Launch", desc: "Made scheduling effortless with 60-second online booking" },
];

export default function AboutPage() {
    const doctor = teamMembers[0];

    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <AboutClient
                expertiseAreas={expertiseAreas}
                whyChooseItems={whyChooseItems}
                milestones={milestones}
                doctor={doctor}
                clinicInfo={clinicInfo}
            />
        </main>
    );
}
