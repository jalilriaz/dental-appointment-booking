// Mock data constants for client components
// These are used on the landing page and other public pages where DB data isn't fetched

export const clinicInfo = {
    name: "Elite Dental & Aesthetic Centre",
    tagline: "Your Smile, Our Passion",
    address: "Office #6, 1st Floor, Doctors Plaza, 6 Markaz Rd, Next to Islamabad Diagnostic Centre (IDC), G-8 Markaz, G-8/2, Islamabad, 44220",
    phone: "+92-314-5475528",
    email: "info@elitedental.com",
    workingHours: "12:00 PM - 8:00 PM (Mon-Sat)",
    // sundayHours: "2:00 PM - 8:00 PM (Sunday)",
    sundayHours: "Sunday - Closed",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Elite+Dental+%26+Aesthetic+Centre+G-8+Markaz+Islamabad",
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Elite+Dental+%26+Aesthetic+Centre+G-8+Markaz+Islamabad",
    whatsapp: "923085268994",
};

export const serviceHighlights = [
    { name: "Dental Implants", icon: "MedicalServices", desc: "Permanent solution for missing teeth", priceFrom: "Rs. 70,000" },
    { name: "Teeth Whitening", icon: "AutoAwesome", desc: "Brighter smile in one session", priceFrom: "Rs. 22,000" },
    { name: "Scaling & Polish", icon: "CleanHands", desc: "Professional oral hygiene cleaning", priceFrom: "Rs. 2,500" },
    { name: "Root Canal", icon: "Build", desc: "Save and restore damaged teeth", priceFrom: "Rs. 13,000" },
    { name: "Braces & Aligners", icon: "Mood", desc: "Straighten teeth with modern tech", priceFrom: "Rs. 75,000" },
    { name: "Dental Veneers", icon: "Diamond", desc: "Custom shells for a flawless smile", priceFrom: "Rs. 7,000" },
];

export const testimonials = [
    {
        name: "Hina Aman",
        text: "The treatment was handled very gently and explained clearly. The whole experience was comfortable, reassuring, and highly professional.",
        rating: 5,
        treatment: "Orthodontics & Alignment",
    },
    {
        name: "Ayesha Shahid",
        text: "I had a very positive experience at the clinic. Dr. Shehryar took the time to answer all my questions and made me feel completely at ease throughout the treatment.",
        rating: 5,
        treatment: "Cosmetic Restoration",
    },
    {
        name: "Hamza",
        text: "The doctor was professional, patient and very clear about the treatment process. Everything was explained before starting the procedure with transparent options.",
        rating: 5,
        treatment: "Dental Implant Consultation",
    },
    {
        name: "Zara",
        text: "Very happy with the overall experience. Dr. Shehryar was attentive and made sure I understood the procedure and after-care instructions clearly.",
        rating: 5,
        treatment: "Comprehensive Smile Care",
    },
    {
        name: "Fatima Khan",
        text: "My orthodontic journey has been smooth and comfortable. Dr. Shehryar explains every step clearly. Very satisfied with the care at G-8 Markaz!",
        rating: 5,
        treatment: "Invisible Aligners",
    },
];

export const teamMembers = [
    {
        name: "Dr. Shehryar Akhtar",
        role: "Dental Surgeon & Orthodontist",
        experience: "12+ years",
        qualification: "BDS | MDS Orthodontist / Speciality Registrar | Certification in Restorative Dentistry",
        image: "/dr_sheriyaar.webp",
    },
];

export const trustStats = [
    { label: "Happy Patients", value: "5,000+" },
    { label: "Years of Excellence", value: "10+" },
    { label: "Treatments Completed", value: "12,000+" },
    // { label: "Expert Doctors", value: "1" },
];

export const whyChooseUs = [
    // { title: "State-of-the-Art Equipment", desc: "Latest dental technology for precise, comfortable treatments", icon: "Bolt" },
    // { title: "Experienced Team", desc: "Our doctors bring decades of combined experience", icon: "Doctor" },
    // { title: "Affordable Pricing", desc: "Quality dental care at competitive prices with PKR transparency", icon: "💰" },
    // { title: "Patient-First Approach", desc: "Your comfort and satisfaction is our top priority", icon: "❤️" },
    // { title: "Convenient Hours", desc: "Open 12 PM to 8 PM ", icon: "🕐" },
    // { title: "Easy Online Booking", desc: "Book your appointment anytime from your phone or laptop", icon: "📱" },
    { title: "Personal Care by Dr. Shehryar Akhtar", desc: "Every patient is treated directly by our head dental surgeon, no handoffs, no junior assistants doing the work", icon: "MedicalServices" },
    { title: "Modern Digital X-Rays", desc: "90% less radiation than traditional X-rays with instant on-screen results", icon: "Bolt" },
    // { title: "Transparent PKR Pricing", desc: "No hidden fees — you'll know the full cost before any treatment begins", icon: "💰" },
    { title: "No Surprise Bills", desc: "Full treatment breakdown explained before we begin , you decide, we proceed", icon: "✅" },
    { title: "Gentle & Pain-Free Focus", desc: "Specialized in anxious patients — we go at your pace, every time", icon: "🤲" },
    { title: "Evening Appointments Available", desc: "Open 12 PM – 8 PM so you never have to skip work for a dental visit", icon: "🕐" },
    { title: "Book in 60 Seconds", desc: "Pick your slot online anytime , no phone calls, no waiting on hold", icon: "📱" },
];
