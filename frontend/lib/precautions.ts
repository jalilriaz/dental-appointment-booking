import { clinicInfo } from "@/app/constants/mockData";

export interface PrecautionInfo {
    category: string;
    precautions: string[];
}

const DEFAULT_PRECAUTIONS: Record<string, string[]> = {
    implant: [
        "Avoid chewing directly on the implant site for the first 48–72 hours.",
        "Stick to soft, cool, or room-temperature foods; avoid hot beverages and spicy foods today.",
        "Do not vigorously spit, rinse, or drink with a straw to prevent disturbing the surgical site.",
        "Take prescribed antibiotics and pain medications strictly as directed.",
        "Apply an ice pack to your cheek (15 mins on, 15 mins off) if mild swelling occurs."
    ],
    whitening: [
        "Follow the 'White Diet' for the next 48 hours — avoid dark foods/liquids (tea, coffee, soda, soy sauce, curries, berries).",
        "Avoid smoking or tobacco products for at least 48 hours to preserve your shade.",
        "If you experience mild tooth sensitivity, use a sensitive toothpaste and avoid icy drinks.",
        "Rinse with lukewarm water after eating to keep teeth pristine."
    ],
    scaling: [
        "Avoid consuming heavily pigmented foods or beverages (tea, coffee, turmeric) for the next 24 hours.",
        "Mild tooth sensitivity to cold or air is normal and will subside in 1–2 days.",
        "Brush gently using a soft-bristled toothbrush and use warm saline (salt water) mouth rinses from tomorrow.",
        "Floss daily to maintain fresh, healthy gums."
    ],
    extraction: [
        "Keep firm pressure on the gauze pad for 45–60 minutes. Discard gently afterwards.",
        "Do NOT spit, rinse vigorously, or use a straw for 24 hours to protect the blood clot.",
        "Avoid smoking or alcohol for at least 48 hours to prevent painful dry socket.",
        "Eat cool, soft foods (ice cream, yogurt, mashed potatoes). Avoid hard or hot meals.",
        "Take all prescribed analgesics and antibiotics on schedule."
    ],
    root_canal: [
        "Do not chew or bite hard foods on the treated tooth until the final permanent restoration/crown is placed.",
        "Mild tenderness when biting or chewing is normal for 2–4 days as the surrounding tissue heals.",
        "Continue taking your prescribed pain relief and antibiotics as instructed.",
        "Schedule your follow-up visit promptly for crown fitting or permanent sealing."
    ],
    braces: [
        "Avoid hard, sticky, or chewy foods (nuts, chewing gum, hard candies, popcorn) that can dislodge brackets.",
        "Cut apples, carrots, and solid foods into small bite-sized pieces before chewing.",
        "If brackets or wires cause irritation to your cheeks or lips, place orthodontic wax over the area.",
        "Brush thoroughly around each bracket after every meal to keep gums healthy."
    ],
    filling: [
        "Wait until local anesthesia numbness wears off completely before eating to avoid accidentally biting your tongue or cheek.",
        "Composite (white) fillings set instantly, but avoid biting hard objects (ice, hard shells) on new restorations.",
        "Mild sensitivity to temperature or pressure may occur for a few days.",
        "If your bite feels uneven or high when chewing, contact us for a quick 2-minute bite adjustment."
    ],
    general: [
        "Maintain good oral hygiene with gentle brushing and flossing.",
        "Take any prescribed medication according to the doctor's instructions.",
        "Stay hydrated and avoid extremely hot or hard foods today.",
        "Reach out to our clinic if you experience persistent pain or unexpected symptoms."
    ]
};

export function getPrecautionsForTreatment(treatmentName: string, customInstructions?: string | null): string[] {
    if (customInstructions && customInstructions.trim().length > 0) {
        return customInstructions.split("\n").map(s => s.trim()).filter(Boolean);
    }

    const t = treatmentName.toLowerCase();
    if (t.includes("implant")) return DEFAULT_PRECAUTIONS.implant;
    if (t.includes("whiten")) return DEFAULT_PRECAUTIONS.whitening;
    if (t.includes("scaling") || t.includes("polish") || t.includes("clean")) return DEFAULT_PRECAUTIONS.scaling;
    if (t.includes("extract") || t.includes("removal") || t.includes("surgical")) return DEFAULT_PRECAUTIONS.extraction;
    if (t.includes("root canal") || t.includes("rct") || t.includes("endodontic")) return DEFAULT_PRECAUTIONS.root_canal;
    if (t.includes("brace") || t.includes("aligner") || t.includes("ortho")) return DEFAULT_PRECAUTIONS.braces;
    if (t.includes("fill") || t.includes("composite") || t.includes("restoration")) return DEFAULT_PRECAUTIONS.filling;

    return DEFAULT_PRECAUTIONS.general;
}

export function formatPrecautionsMessage(params: {
    patientName: string;
    treatmentName: string;
    precautions: string[];
    doctorName?: string;
}): string {
    const doctor = params.doctorName || "Dr. Sheriyaar";
    const bullets = params.precautions.map(p => `• ${p}`).join("\n");

    return `🦷 *Elite Dental Centre — Post-Treatment Care*

Dear *${params.patientName}*,

Thank you for visiting today! Here are your recommended post-procedure care precautions for your *${params.treatmentName}* with *${doctor}*:

📌 *Care Instructions:*
${bullets}

⚠️ *Assistance & Support:*
If you experience prolonged bleeding, intense swelling, or unexpected discomfort, please message us directly on this WhatsApp or call *${clinicInfo.phone}*.

Wishing you a fast, smooth recovery! ✨
*Elite Dental Centre*
${clinicInfo.address}`;
}

export function generateWhatsAppDeepLink(phone: string, text: string): string {
    // Sanitize phone number (strip spaces, +, hyphens)
    let cleaned = phone.replace(/[^0-9]/g, "");
    // If standard Pakistani local format 03xx, convert to 923xx
    if (cleaned.startsWith("0") && cleaned.length === 11) {
        cleaned = "92" + cleaned.substring(1);
    }
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
}

export async function dispatchN8nPrecautionsWebhook(payload: {
    phone: string;
    patientName: string;
    treatmentName: string;
    precautions: string[];
    message: string;
    appointmentId?: string;
}): Promise<{ success: boolean; error?: string }> {
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
        return { success: false, error: "N8N_WEBHOOK_URL not configured" };
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s timeout

        const res = await fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(process.env.N8N_SECRET_KEY ? { "Authorization": `Bearer ${process.env.N8N_SECRET_KEY}` } : {})
            },
            body: JSON.stringify({
                event: "SEND_PRECAUTIONS",
                timestamp: new Date().toISOString(),
                ...payload
            }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
            return { success: true };
        } else {
            return { success: false, error: `Webhook returned status ${res.status}` };
        }
    } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error connecting to n8n webhook";
        return { success: false, error: msg };
    }
}
