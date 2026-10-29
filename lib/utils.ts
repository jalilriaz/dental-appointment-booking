import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { StatusConfig } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPKR(amount: number) {
  return `Rs. ${amount.toLocaleString("en-PK")}`;
}

/** Format a date string/Date to a human-readable date. */
export function formatDate(
  date: string | Date,
  style: "short" | "medium" | "long" | "month-year" = "medium"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const opts: Record<string, Intl.DateTimeFormatOptions> = {
    short: { month: "short", day: "numeric" },
    medium: { month: "short", day: "numeric", year: "numeric" },
    long: { weekday: "long", month: "long", day: "numeric", year: "numeric" },
    "month-year": { month: "short", year: "numeric" },
  };
  return d.toLocaleDateString("en-PK", opts[style]);
}

/** Format a date string/Date to a human-readable time (e.g. "2:30 PM"). */
export function formatTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-PK", { hour: "numeric", minute: "2-digit", hour12: true });
}

/** Format a date string/Date to "Mar 9, 2026, 2:30 PM". */
export function formatDateTime(date: string | Date): string {
  return `${formatDate(date, "medium")}, ${formatTime(date)}`;
}

export const statusColors: Record<string, string> = {
  SCHEDULED: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
  RESCHEDULED: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  COMPLETED: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
  CANCELLED: "bg-red-500/15 text-red-400 border border-red-500/20",
  NO_SHOW: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
};

/** Rich status config with label, text color, and badge background. */
export const statusConfig: Record<string, StatusConfig> = {
  SCHEDULED: { label: "Scheduled", color: "text-blue-300", bg: "badge-scheduled" },
  COMPLETED: { label: "Checked Out", color: "text-emerald-300", bg: "badge-completed" },
  CANCELLED: { label: "Cancelled", color: "text-red-300", bg: "badge-cancelled" },
  NO_SHOW: { label: "Missed (No-Show)", color: "text-amber-300", bg: "badge-no-show" },
  RESCHEDULED: { label: "Rescheduled", color: "text-purple-300", bg: "badge-rescheduled" },
};

export function getTreatmentImage(name: string): string {
  const n = name.toLowerCase();

  // ── Implants ────────────────────────────────────────────
  if (n.includes("german") && n.includes("implant")) return "/images/services/german_implant.png";
  if (n.includes("american") && n.includes("implant")) return "/images/services/american_implant.png";
  if (n.includes("swiss") && n.includes("implant")) return "/images/services/korean_implant.png";
  if (n.includes("korean") && n.includes("implant")) return "/images/services/korean_implant.png";
  if (n.includes("implant")) return "/images/services/german_implant.png";

  // ── Whitening ───────────────────────────────────────────
  if (n.includes("laser") && (n.includes("whiten") || n.includes("whitening"))) return "/images/services/laser_whitening.png";
  if (n.includes("american") && (n.includes("whiten") || n.includes("whitening"))) return "/images/services/american_whitening.png";
  if (n.includes("german") && (n.includes("whiten") || n.includes("whitening"))) return "/images/services/german_whitening.png";
  if (n.includes("whiten") || n.includes("whitening")) return "/images/services/american_whitening.png";

  // ── Scaling & Cleaning ─────────────────────────────────
  if (n.includes("deep") && (n.includes("scal") || n.includes("polish"))) return "/images/services/deep_scaling.png";
  if (n.includes("full mouth") || (n.includes("scal") && n.includes("polish"))) return "/images/services/full_mouth_scaling.png";
  if (n.includes("basic") && n.includes("scal")) return "/images/services/basic_scaling.png";
  if (n.includes("scal") && n.includes("polish")) return "/images/services/full_mouth_scaling.png";
  if (n.includes("scale") || n.includes("scal") || n.includes("polish") || n.includes("clean")) return "/images/services/basic_scaling.png";

  // ── Root Canal Treatment ───────────────────────────────
  if (n.includes("multi") && (n.includes("rct") || n.includes("root") || n.includes("canal"))) return "/images/services/multi_canal_rct.png";
  if (n.includes("single") && (n.includes("rct") || n.includes("root") || n.includes("canal"))) return "/images/services/single_canal_rct.png";
  if (n.includes("root") || n.includes("rct") || n.includes("canal")) return "/images/services/single_canal_rct.png";

  // ── Extractions ─────────────────────────────────────────
  if (n.includes("wisdom")) return "/images/services/wisdom_tooth_extraction.png";
  if (n.includes("surgical") && n.includes("extract")) return "/images/services/surgical_extraction.png";
  if (n.includes("simple") && n.includes("extract")) return "/images/services/simple_extraction.png";
  if (n.includes("extract")) return "/images/services/simple_extraction.png";

  // ── Orthodontics ────────────────────────────────────────
  if (n.includes("invisible") || n.includes("aligner")) return "/images/services/invisible_aligners.png";
  if (n.includes("ceramic") && n.includes("brace")) return "/images/services/ceramic_braces.png";
  if (n.includes("metal") && n.includes("brace")) return "/images/services/metal_braces.png";
  if (n.includes("brace") || n.includes("align")) return "/images/services/metal_braces.png";

  // ── Crowns ──────────────────────────────────────────────
  if (n.includes("zirconia") && n.includes("e max")) return "/images/services/dental_veneers.png";
  if (n.includes("pfm") && n.includes("crown")) return "/images/services/dental_crown.png";
  if (n.includes("zirconia") && n.includes("crown")) return "/images/services/dental_crown.png";
  if (n.includes("crown") || n.includes("bridge")) return "/images/services/dental_crown.png";

  // ── Veneers ─────────────────────────────────────────────
  if (n.includes("lumineer")) return "/images/services/dental_veneers.png";
  if (n.includes("veneer")) return "/images/services/dental_veneers.png";

  // ── Fillings ────────────────────────────────────────────
  if (n.includes("composite") && n.includes("laser") && n.includes("fill")) return "/images/services/laser_whitening.png";
  if (n.includes("amalgam") && n.includes("fill")) return "/images/services/dental_filling.png";
  if (n.includes("gic") && n.includes("fill")) return "/images/services/single_canal_rct.png";
  if (n.includes("temporary") && n.includes("fill")) return "/images/services/simple_extraction.png";
  if (n.includes("fill")) return "/images/services/dental_filling.png";

  return "/images/services/general.png";
}

/** Returns a rich fallback description when the DB description is empty. */
export function getServiceDescription(name: string): string {
  const n = name.toLowerCase();

  // Implants
  if (n.includes("german") && n.includes("implant"))
    return "Premium German-engineered titanium implants with exceptional biocompatibility. A permanent, natural-looking solution for missing teeth that functions just like your own.";
  if (n.includes("american") && n.includes("implant"))
    return "High-quality American dental implants designed for durability and a seamless fit. Restores your bite and confidence with a tooth that lasts a lifetime.";
  if (n.includes("swiss") && n.includes("implant"))
    return "Precision Swiss-made implants known for accuracy and longevity. Ideal for patients seeking the highest standard of restorative dentistry.";
  if (n.includes("korean") && n.includes("implant"))
    return "Cost-effective Korean implants with proven clinical results. A reliable option for tooth replacement without compromising on quality.";
  if (n.includes("implant"))
    return "A permanent, natural-looking solution for missing teeth. Our dental implants are surgically placed to restore your smile, bite, and confidence.";

  // Whitening
  if (n.includes("laser") && (n.includes("whiten") || n.includes("whitening")))
    return "Advanced laser whitening that brightens your teeth up to 8 shades in a single session. Quick, painless, and delivers instantly visible results.";
  if (n.includes("american") && (n.includes("whiten") || n.includes("whitening")))
    return "Professional American whitening system using FDA-approved gel for a safe, even brightening effect. Achieve a celebrity-level smile in about an hour.";
  if (n.includes("german") && (n.includes("whiten") || n.includes("whitening")))
    return "Premium German whitening formula with enamel-safe technology. Removes years of staining for a brilliantly white, natural-looking smile.";
  if (n.includes("whiten") || n.includes("whitening"))
    return "Professional teeth whitening to remove stains and discoloration. Get a noticeably brighter smile in a single comfortable visit.";

  // Scaling & Cleaning
  if (n.includes("deep") && (n.includes("scal") || n.includes("polish")))
    return "Thorough deep scaling below the gumline to remove stubborn tartar and bacteria. Essential for patients with gum disease or heavy buildup.";
  if (n.includes("full mouth") || (n.includes("scal") && n.includes("polish")))
    return "Complete scaling and polishing treatment for the entire mouth. Removes plaque, tartar, and surface stains for healthier gums and fresher breath.";
  if (n.includes("scal") || n.includes("clean") || n.includes("polish"))
    return "Professional cleaning to remove plaque and tartar buildup, preventing cavities and gum disease. Recommended every 6 months for optimal oral health.";

  // Root Canal
  if (n.includes("multi") && (n.includes("rct") || n.includes("root") || n.includes("canal")))
    return "Multi-canal root canal treatment for molars with complex root systems. Saves severely infected teeth with precision endodontic techniques.";
  if (n.includes("single") && (n.includes("rct") || n.includes("root") || n.includes("canal")))
    return "Single-canal root canal therapy to remove infection and preserve your natural tooth. Performed with modern anesthetics for a pain-free experience.";
  if (n.includes("root") || n.includes("rct") || n.includes("canal"))
    return "Root canal therapy to eliminate infection deep inside your tooth and save it from extraction. Modern techniques make it virtually painless.";

  // Extractions
  if (n.includes("wisdom"))
    return "Safe and comfortable wisdom tooth extraction by experienced oral surgeons. We handle both impacted and erupted wisdom teeth with minimal discomfort.";
  if (n.includes("surgical") && n.includes("extract"))
    return "Surgical extraction for complex cases including impacted, broken, or deeply rooted teeth. Performed under local anesthesia with careful precision.";
  if (n.includes("simple") && n.includes("extract"))
    return "Quick and comfortable simple extraction for loose or damaged teeth. A straightforward procedure with fast healing and minimal aftercare.";
  if (n.includes("extract"))
    return "Professional tooth extraction when a tooth cannot be saved. We ensure maximum comfort with proper anesthesia and clear aftercare instructions.";

  // Orthodontics
  if (n.includes("invisible") || n.includes("aligner"))
    return "Clear, removable aligners that straighten your teeth invisibly. No metal brackets — just a discreet path to a perfectly aligned smile.";
  if (n.includes("ceramic") && n.includes("brace"))
    return "Tooth-colored ceramic braces that blend with your natural teeth. All the effectiveness of traditional braces with a much more subtle appearance.";
  if (n.includes("metal") && n.includes("brace"))
    return "Proven metal braces for effective teeth straightening. The most reliable and affordable orthodontic solution for all ages.";
  if (n.includes("brace") || n.includes("align"))
    return "Orthodontic treatment to correct crooked, crowded, or misaligned teeth. We offer multiple options to fit your lifestyle and budget.";

  // Crowns
  if (n.includes("zirconia") && n.includes("crown"))
    return "Ultra-strong zirconia crowns that look completely natural. Resistant to chipping and staining, they're the gold standard in modern dental restoration.";
  if (n.includes("pfm") && n.includes("crown"))
    return "Porcelain-fused-to-metal crowns combining strength and aesthetics. An excellent choice for back teeth that need to withstand heavy chewing forces.";
  if (n.includes("crown") || n.includes("bridge"))
    return "Custom-made dental crowns and bridges to restore damaged or missing teeth. Precision-crafted for a natural look and comfortable bite.";

  // Veneers
  if (n.includes("veneer") || n.includes("lumineer"))
    return "Ultra-thin porcelain shells bonded to the front of your teeth for a flawless smile. Corrects chips, gaps, stains, and uneven teeth beautifully.";

  // Fillings
  if (n.includes("composite") && n.includes("fill"))
    return "Tooth-colored composite fillings that blend seamlessly with your natural teeth. A durable, mercury-free solution for cavities and minor chips.";
  if (n.includes("amalgam") && n.includes("fill"))
    return "Durable silver amalgam fillings for strong, long-lasting cavity repairs. Cost-effective and proven to withstand heavy biting forces on back teeth.";
  if (n.includes("fill"))
    return "Professional dental fillings to repair cavities and restore tooth structure. We use modern materials for a natural, comfortable result.";

  // Fallback
  return "Professional dental care tailored to your specific needs. Our experienced team uses modern techniques and equipment to ensure the best possible outcome for your smile.";
}

export function isSunday(dateStr: string): boolean {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getDay() === 0;
}
