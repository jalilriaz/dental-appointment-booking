"use server";

import prisma from "@/lib/prisma";
import { generatePatientCode } from "@/lib/patientCode";
import { normalizePhone, isValidPakistaniPhone } from "@/lib/phone";
import { generateRandomPatientPasswordHash } from "@/lib/security";
import { revalidatePath } from "next/cache";

export interface RegisterPatientInput {
    name: string;
    phone: string;
    email?: string;
    gender?: string;
    dateOfBirth?: string;
    medicalAlerts?: string;
    address?: string;
}

export async function registerNewPatient(input: RegisterPatientInput) {
    try {
        const name = input.name?.trim();
        if (!name || name.length < 2) {
            return { success: false, error: "Patient name is required (at least 2 characters)." };
        }

        const rawPhone = input.phone?.trim();
        if (!rawPhone) {
            return { success: false, error: "Mobile phone number is required." };
        }

        const canonicalPhone = normalizePhone(rawPhone);
        if (!isValidPakistaniPhone(canonicalPhone)) {
            return {
                success: false,
                error: "Please enter a valid Pakistani mobile number (e.g. 0300 1234567 or +923001234567).",
            };
        }

        // Check if phone already registered
        const existingByPhone = await prisma.user.findUnique({
            where: { phone: canonicalPhone },
        });

        if (existingByPhone) {
            return {
                success: false,
                error: `A patient is already registered with this phone number (${existingByPhone.name || "Existing Patient"}${existingByPhone.patientCode ? ` · MRN #${existingByPhone.patientCode}` : ""}).`,
            };
        }

        // Check email uniqueness if provided
        const cleanEmail = input.email?.trim().toLowerCase() || null;
        if (cleanEmail) {
            const existingByEmail = await prisma.user.findUnique({
                where: { email: cleanEmail },
            });
            if (existingByEmail) {
                return {
                    success: false,
                    error: `A user is already registered with email address (${cleanEmail}).`,
                };
            }
        }

        const patientCode = await generatePatientCode();
        const initialPasswordHash = await generateRandomPatientPasswordHash();

        let parsedDob: Date | undefined = undefined;
        if (input.dateOfBirth) {
            const d = new Date(input.dateOfBirth);
            if (!isNaN(d.getTime())) {
                parsedDob = d;
            }
        }

        const newPatient = await prisma.user.create({
            data: {
                name,
                phone: canonicalPhone,
                email: cleanEmail,
                role: "PATIENT",
                patientCode,
                password: initialPasswordHash,
                gender: input.gender?.trim() || null,
                dateOfBirth: parsedDob,
                medicalAlerts: input.medicalAlerts?.trim() || null,
                address: input.address?.trim() || null,
            },
        });

        revalidatePath("/admin/patients");
        revalidatePath("/staff/patients");

        return {
            success: true,
            patient: {
                id: newPatient.id,
                name: newPatient.name,
                patientCode: newPatient.patientCode,
                phone: newPatient.phone,
                email: newPatient.email,
                gender: newPatient.gender,
                dateOfBirth: newPatient.dateOfBirth?.toISOString() || null,
                medicalAlerts: newPatient.medicalAlerts,
                address: newPatient.address,
                createdAt: newPatient.createdAt.toISOString(),
                appointmentCount: 0,
                lastAppointment: null,
                activePlan: null,
            },
        };
    } catch (error: any) {
        console.error("Failed to register patient:", error);
        return {
            success: false,
            error: error?.message || "Failed to register new patient. Please check database connectivity.",
        };
    }
}

