/**
 * Centralized WhatsApp Link Generator for Elite Dental Centre.
 * Clinic WhatsApp: +92 314 5475528
 */

export const CLINIC_WHATSAPP_NUMBER = "923145475528";
export const CLINIC_PHONE_DISPLAY = "+92 314 5475528";

/**
 * Returns a direct WhatsApp URL pre-filled with patient booking intent.
 * Automatically handled by the clinic's AI chatbot and front desk.
 */
export function getWhatsAppBookingUrl(treatmentName?: string, customNote?: string): string {
  let message =
    "Hello Elite Dental Centre, I would like to book a dental appointment. Please guide me on available slots.";

  if (treatmentName && treatmentName.trim().length > 0) {
    message = `Hello Elite Dental Centre, I would like to book an appointment for ${treatmentName.trim()}.`;
  }

  if (customNote && customNote.trim().length > 0) {
    message += ` Note: ${customNote.trim()}`;
  }

  return `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Returns a direct WhatsApp URL for treatment consultation and clinical inquiries.
 */
export function getWhatsAppDoctorQuestionUrl(treatmentName: string): string {
  const message = `Hello Doctor, I have questions regarding ${treatmentName.trim()}. Could you please advise on treatment options and consultation?`;
  return `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
