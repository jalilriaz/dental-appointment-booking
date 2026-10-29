# Elite Dental Centre — n8n WhatsApp Integration Guide

This guide details the complete configuration required to connect your **n8n WhatsApp AI Chatbot Assistant** and **Doctor Post-Treatment Care Precautions** with the Elite Dental Centre Next.js application.

---

## 1. Clinic Setup & Security Credentials

- **Clinic Name:** Elite Dental Centre
- **Doctor / Clinic Owner:** Dr. Sheriyaar (Admin)
- **Clinic WhatsApp:** `+92-314-5475528` (`923145475528`)
- **Clinic Location:** F-10 Markaz, Islamabad, Pakistan
- **Clinic Working Hours:** Monday – Saturday, 11:00 AM – 9:00 PM (Closed on Sundays)

### Environment Variables in `.env`
Ensure your `.env` contains:
```env
# Shared secret protecting all /api/bot/* endpoints
N8N_SECRET_KEY="elite-dental-n8n-bot-secret-key-2026"

# Webhook URL where Next.js posts automated precautions for n8n to send
N8N_WEBHOOK_URL="http://localhost:5678/webhook/elite-dental-precautions"
```

---

## 2. API Endpoints for n8n WhatsApp AI Assistant

All requests from n8n to the Next.js server require the following authorization header:
```
Authorization: Bearer elite-dental-n8n-bot-secret-key-2026
Content-Type: application/json
```

---

### 2.1. Check Slot Availability
Call this node when a patient suggests a preferred date and time to verify the clinic is open and no other patient is booked.

- **Method:** `POST`
- **URL:** `http://<SERVER_HOST>:3000/api/bot/check-availability`
- **Headers:**
  - `Authorization: Bearer elite-dental-n8n-bot-secret-key-2026`
  - `Content-Type: application/json`
- **JSON Body:**
  ```json
  {
    "date": "2026-10-31",
    "time": "14:00"
  }
  ```
- **Responses:**
  - **Available:**
    ```json
    {
      "isAvailable": true,
      "message": "Time slot is available."
    }
    ```
  - **Unavailable / Double Booked:**
    ```json
    {
      "isAvailable": false,
      "message": "An appointment already exists at this time."
    }
    ```
  - **Sunday (Closed):**
    ```json
    {
      "isAvailable": false,
      "message": "The clinic is closed on Sundays. Please select a different day (Monday-Saturday)."
    }
    ```

---

### 2.2. Book New Appointment
Call this node once the patient confirms their details (name, phone, procedure, date, time).

- **Method:** `POST`
- **URL:** `http://<SERVER_HOST>:3000/api/bot/book-appointment`
- **Headers:**
  - `Authorization: Bearer elite-dental-n8n-bot-secret-key-2026`
  - `Content-Type: application/json`
- **JSON Body:**
  ```json
  {
    "patientName": "Hamza Ali",
    "phone": "+923001234567",
    "age": 29,
    "serviceType": "Basic Scaling",
    "date": "2026-10-31",
    "time": "14:00"
  }
  ```
- **Responses:**
  - **Success (HTTP 200):**
    ```json
    {
      "success": true,
      "message": "Appointment booked successfully.",
      "patientCode": 1001,
      "appointment": {
        "id": "6247b6d9-25f3-48e1-80bd-af0958f49835",
        "startTime": "2026-10-31T09:00:00.000Z",
        "endTime": "2026-10-31T09:30:00.000Z",
        "status": "SCHEDULED",
        "bookedBy": "WHATSAPP_BOT"
      }
    }
    ```
  - **Conflict / Already Taken (HTTP 409):**
    ```json
    {
      "message": "An appointment already exists at this time. Please select another time slot."
    }
    ```

> **Note:** The endpoint automatically assigns a permanent Patient Code (e.g. `1001`), creates/links the unified Patient user profile, tags the booking source as `WHATSAPP_BOT`, and synchronizes the appointment to Dr. Sheriyaar's Google Calendar.

---

### 2.3. Reschedule Appointment
Call this node when a patient wants to change their upcoming appointment.

- **Method:** `PATCH`
- **URL:** `http://<SERVER_HOST>:3000/api/bot/reschedule`
- **Headers:**
  - `Authorization: Bearer elite-dental-n8n-bot-secret-key-2026`
  - `Content-Type: application/json`
- **JSON Body:**
  ```json
  {
    "phone": "+923001234567",
    "newDate": "2026-11-02",
    "newTime": "15:30",
    "currentDate": "2026-10-31" 
  }
  ```
  *(Note: `currentDate` is optional; if omitted, the bot updates the patient's soonest upcoming appointment).*
- **Responses:**
  - **Success (HTTP 200):**
    ```json
    {
      "success": true,
      "message": "Appointment rescheduled successfully.",
      "appointment": { ... }
    }
    ```
  - **Not Found (HTTP 404):**
    ```json
    {
      "message": "No upcoming scheduled appointments found for this phone number."
    }
    ```

---

### 2.4. Cancel Appointment
Call this node when a patient requests cancellation.

- **Method:** `PATCH`
- **URL:** `http://<SERVER_HOST>:3000/api/bot/cancel`
- **Headers:**
  - `Authorization: Bearer elite-dental-n8n-bot-secret-key-2026`
  - `Content-Type: application/json`
- **JSON Body:**
  ```json
  {
    "phone": "+923001234567",
    "currentDate": "2026-10-31"
  }
  ```
- **Responses:**
  - **Success (HTTP 200):**
    ```json
    {
      "success": true,
      "message": "Appointment cancelled successfully.",
      "appointmentId": "6247b6d9-25f3-48e1-80bd-af0958f49835"
    }
    ```

---

## 3. Post-Treatment Precautions (Doctor 1-Click Feature)

When a patient completes their dental visit, Dr. Sheriyaar has two seamless options in the web application:
1. **Automated n8n Webhook Dispatch:** When completing checkout or viewing the patient's history profile, clicking "Send Care Precautions" sends a webhook payload to n8n to send the WhatsApp message automatically.
2. **Direct 1-Click WhatsApp Button (`wa.me`):** A pre-formatted click-to-chat button opens WhatsApp Web or WhatsApp Desktop immediately with the customized precautions already filled in.

### Webhook Received by n8n:
- **Webhook Path:** `POST /webhook/elite-dental-precautions`
- **Payload Schema:**
  ```json
  {
    "event": "appointment.precautions_sent",
    "appointmentId": "904c2f78-cd86-4f32-8210-a8f310f83740",
    "phone": "+92-300-1111111",
    "patientName": "Ali Khan",
    "treatmentName": "German Implant Kit",
    "precautions": [
      "Avoid hard foods for 2 weeks. Follow-up in 7 days."
    ],
    "message": "🦷 *Elite Dental Centre — Post-Treatment Care*\n\nDear *Ali Khan*,\n\nThank you for visiting today! Here are your recommended post-procedure care precautions for your *German Implant Kit* with *Dr. Sheriyaar*:\n\n📌 *Care Instructions:*\n• Avoid hard foods for 2 weeks. Follow-up in 7 days.\n\n⚠️ *Assistance & Support:*\nIf you experience prolonged bleeding, intense swelling, or unexpected discomfort, please message us directly on this WhatsApp or call *+92-314-5475528*.\n\nWishing you a fast, smooth recovery! ✨\n*Elite Dental Centre*\nF-10 Markaz, Islamabad, Pakistan",
    "timestamp": "2026-10-26T10:47:35.000Z"
  }
  ```

In n8n, attach an **HTTP Request node** (or WhatsApp Cloud API / Evolution API / Twilio node) downstream of this Webhook node:
- **Recipient:** `{{ $json.phone }}`
- **Message:** `{{ $json.message }}`

---

## 4. AI Assistant System Prompt for n8n

Below is the recommended System Prompt for the AI Agent node in n8n handling incoming WhatsApp messages:

```markdown
You are the friendly, professional AI Dental Care Coordinator for "Elite Dental Centre" located in F-10 Markaz, Islamabad, Pakistan, headed by Dr. Sheriyaar.

Your primary duties are:
1. Greet patients warmly and assist them with booking new appointments, rescheduling existing visits, or cancelling appointments.
2. Provide information about clinic procedures (Dental Implants, Teeth Whitening, Scaling & Polishing, Root Canal Treatment, Extractions, Braces & Aligners, Veneers).
3. Check availability using the Check Availability tool before confirming any time.
4. Always ask for:
   - Patient Full Name
   - Phone Number
   - Desired Treatment
   - Preferred Date and Time (Monday through Saturday, 11:00 AM – 9:00 PM).
5. Remember: The clinic is strictly closed on Sundays.
6. Once date, time, name, and phone are verified, call the Book Appointment tool and provide the patient with their confirmation and Patient Code.
7. Maintain a polite, empathetic, and professional tone at all times.
```

---

## 5. Summary of UI Touchpoints in Admin Dashboard

1. **Website CTA:** All "Book Appointment" buttons redirect patients to `https://wa.me/923145475528?text=Hi,%20I%20would%20like%20to%20book%20an%20appointment...`
2. **Dashboard Real-Time View:** Bookings from WhatsApp appear instantly on the Admin Appointments table with the badge **WHATSAPP BOT**.
3. **Checkout Flow:** When Dr. Jalil completes a visit and enters the payment, the **Care Precautions Modal** opens automatically with the procedure's guidelines ready to send.
4. **Patient Profile & History:** The treatment table features a green **Care Precautions** button on every completed appointment row for easy follow-ups.
