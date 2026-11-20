import prisma from "./prisma";

export interface BookingWebhookPayload {
    phone: string;
    patientName: string;
    treatmentName: string;
    doctorName?: string;
    date: string;
    time: string;
    appointmentId: string;
    patientCode?: number | null;
}

/**
 * Dispatches an automated WhatsApp confirmation event to n8n webhook
 * whenever an appointment is booked on the website portal.
 */
export async function dispatchN8nBookingWebhook(payload: BookingWebhookPayload): Promise<{ success: boolean; error?: string }> {
    try {
        // 1. Fetch dynamic clinic settings for message formatting
        const settings = await prisma.systemSettings.findUnique({ where: { id: "settings" } }).catch(() => null);
        const clinicName = settings?.clinicName || "Elite Dental & Aesthetic Centre";
        const clinicAddress = settings?.clinicAddress || "Office# 6, 1st Floor, Doctors Plaza, G-8 Markaz, Islamabad";
        const clinicPhones = settings?.landlinePhone || settings?.mobilePhone || "051-2340093 / 0303-5080011";

        // 2. Clean phone number for Meta WhatsApp Cloud API (e.g. +92 314 5475528 -> 923145475528)
        let sanitizedPhone = payload.phone.replace(/[^0-9]/g, "");
        if (sanitizedPhone.startsWith("0") && sanitizedPhone.length === 11) {
            sanitizedPhone = "92" + sanitizedPhone.substring(1);
        }

        // 3. Construct professional, formatted WhatsApp message
        const formattedMessage =
            `Assalam-o-Alaikum *${payload.patientName}*,\n\n` +
            `Your dental appointment at *${clinicName}* has been successfully booked! 🎉\n\n` +
            `📋 *Appointment Details:*\n` +
            `• *Treatment:* ${payload.treatmentName}\n` +
            `• *Attending Doctor:* ${payload.doctorName || "Dr. Sheriyaar"}\n` +
            `• *Date:* ${payload.date}\n` +
            `• *Time:* ${payload.time}\n` +
            (payload.patientCode ? `• *Patient Code:* #${payload.patientCode}\n` : "") +
            `• *Location:* ${clinicAddress}\n` +
            `• *Clinic Contact:* ${clinicPhones}\n\n` +
            `Please arrive 10 minutes prior to your time slot. If you ever need to adjust your visit, simply reply *RESCHEDULE* or *CANCEL* directly to this WhatsApp chat.`;

        const fullPayload = {
            event: "NEW_WEBSITE_BOOKING",
            timestamp: new Date().toISOString(),
            phone: sanitizedPhone,
            message: formattedMessage,
            appointmentId: payload.appointmentId,
            patientName: payload.patientName,
            treatmentName: payload.treatmentName,
            doctorName: payload.doctorName || "Dr. Sheriyaar",
            date: payload.date,
            time: payload.time,
            patientCode: payload.patientCode,
            clinicName,
            clinicAddress,
            clinicPhones,
        };

        // 4. Try endpoints with fallback (booking webhook first, precautions webhook fallback, localhost / host.docker.internal)
        const primaryUrl = process.env.N8N_BOOKING_WEBHOOK_URL || "http://localhost:5678/webhook/elite-dental-booking";
        const fallbackUrl = process.env.N8N_WEBHOOK_URL || "http://localhost:5678/webhook/elite-dental-precautions";

        const urlsToTry = [primaryUrl, fallbackUrl];
        if (primaryUrl.includes("localhost")) {
            urlsToTry.push(primaryUrl.replace("localhost", "host.docker.internal"));
        } else if (primaryUrl.includes("host.docker.internal")) {
            urlsToTry.push(primaryUrl.replace("host.docker.internal", "localhost"));
        }
        if (fallbackUrl.includes("localhost")) {
            urlsToTry.push(fallbackUrl.replace("localhost", "host.docker.internal"));
        }

        let lastError = "Failed to dispatch to n8n webhook";
        for (const url of Array.from(new Set(urlsToTry))) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

                const res = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(process.env.N8N_SECRET_KEY ? { Authorization: `Bearer ${process.env.N8N_SECRET_KEY}` } : {}),
                    },
                    body: JSON.stringify(fullPayload),
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);

                if (res.ok) {
                    console.log(`[n8n] Successfully dispatched WhatsApp booking confirmation to ${url} for phone: ${sanitizedPhone}`);
                    return { success: true };
                } else {
                    lastError = `Webhook ${url} returned status ${res.status}`;
                }
            } catch (err: any) {
                lastError = err instanceof Error ? err.message : `Network error connecting to ${url}`;
            }
        }

        console.warn("[n8n] Could not dispatch booking confirmation to any n8n webhook:", lastError);
        return { success: false, error: lastError };
    } catch (outerErr: any) {
        console.error("[n8n] Unexpected error in dispatchN8nBookingWebhook:", outerErr);
        return { success: false, error: outerErr?.message || "Unexpected error" };
    }
}
