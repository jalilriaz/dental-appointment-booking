import { getClinicHours } from "@/lib/getClinicHours";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
    const workingHours = await getClinicHours();

    return <ContactForm workingHours={workingHours} />;
}
