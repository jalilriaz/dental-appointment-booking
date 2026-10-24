// Mock data constants for client components
// These are used on the landing page and other public pages where DB data isn't fetched

export const clinicInfo = {
    name: "Elite Dental Centre",
    tagline: "Your Smile, Our Passion",
    address: "F-10 Markaz, Islamabad, Pakistan",
    phone: "+92-314-5475528",
    email: "info@elitedental.com",
    workingHours: "12:00 PM - 8:00 PM (Mon-Sat)",
    // sundayHours: "2:00 PM - 8:00 PM (Sunday)",
    sundayHours: "Sunday - Closed",
    mapUrl: "https://maps.google.com/?q=Rawalpindi+Medical+Plaza",
    whatsapp: "923145475528",
};

export const serviceHighlights = [
    { name: "Dental Implants", icon: "🦷", desc: "Permanent solution for missing teeth", priceFrom: "Rs. 70,000" },
    { name: "Teeth Whitening", icon: "✨", desc: "Brighter smile in one session", priceFrom: "Rs. 22,000" },
    { name: "Scaling & Polish", icon: "🪥", desc: "Professional oral hygiene cleaning", priceFrom: "Rs. 2,500" },
    { name: "Root Canal", icon: "🔧", desc: "Save and restore damaged teeth", priceFrom: "Rs. 13,000" },
    { name: "Braces & Aligners", icon: "😁", desc: "Straighten teeth with modern tech", priceFrom: "Rs. 75,000" },
    { name: "Dental Veneers", icon: "💎", desc: "Custom shells for a flawless smile", priceFrom: "Rs. 7,000" },
];

export const testimonials = [
    {
        name: "Ali Khan",
        text: "Excellent service! My dental implant was completely pain-free. Dr. Sarah is truly professional and caring.",
        rating: 5,
        treatment: "German Implant",
    },
    {
        name: "Sara Ahmed",
        text: "I was nervous about whitening but the team made me feel comfortable. Amazing results — my teeth are 6 shades lighter!",
        rating: 5,
        treatment: "Laser Whitening",
    },
    {
        name: "Hassan Ali",
        text: "Best dental clinic in Rawalpindi. The staff is friendly and the facilities are top-notch. Highly recommended for families.",
        rating: 5,
        treatment: "General Checkup",

    },
    {
        name: "Fatima Khan",
        text: "My invisalign journey has been smooth and comfortable. Dr. Sheriyaar explains every step clearly. Very satisfied!",
        rating: 5,
        treatment: "Invisible Aligners",
    },
];

export const teamMembers = [
    {
        name: "Dr. Sheriyaar",
        role: "General Doctor",
        experience: "12 years",
        qualification: "BDS, RDS",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=400&auto=format&fit=crop",
    },

];

export const trustStats = [
    { label: "Happy Patients", value: "5,000+" },
    { label: "Years of Excellence", value: "10+" },
    { label: "Treatments Completed", value: "12,000+" },
    // { label: "Expert Doctors", value: "1" },
];

export const whyChooseUs = [
    // { title: "State-of-the-Art Equipment", desc: "Latest dental technology for precise, comfortable treatments", icon: "⚡" },
    // { title: "Experienced Team", desc: "Our doctors bring decades of combined experience", icon: "👨‍⚕️" },
    // { title: "Affordable Pricing", desc: "Quality dental care at competitive prices with PKR transparency", icon: "💰" },
    // { title: "Patient-First Approach", desc: "Your comfort and satisfaction is our top priority", icon: "❤️" },
    // { title: "Convenient Hours", desc: "Open 12 PM to 8 PM ", icon: "🕐" },
    // { title: "Easy Online Booking", desc: "Book your appointment anytime from your phone or laptop", icon: "📱" },
    { title: "Personal Care by Dr. Sheriyaar ", desc: "Every patient is treated directly by our head dentist , no handoffs, no assistants doing the work", icon: "🦷" },
    { title: "Modern Digital X-Rays", desc: "90% less radiation than traditional X-rays with instant on-screen results", icon: "⚡" },
    // { title: "Transparent PKR Pricing", desc: "No hidden fees — you'll know the full cost before any treatment begins", icon: "💰" },
    { title: "No Surprise Bills", desc: "Full treatment breakdown explained before we begin , you decide, we proceed", icon: "✅" },
    { title: "Gentle & Pain-Free Focus", desc: "Specialized in anxious patients — we go at your pace, every time", icon: "🤲" },
    { title: "Evening Appointments Available", desc: "Open 12 PM – 8 PM so you never have to skip work for a dental visit", icon: "🕐" },
    { title: "Book in 60 Seconds", desc: "Pick your slot online anytime , no phone calls, no waiting on hold", icon: "📱" },
];
