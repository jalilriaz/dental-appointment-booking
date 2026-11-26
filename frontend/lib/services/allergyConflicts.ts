import type { PrescriptionEntry } from "../validations/clinical-records";

const ALLERGY_DRUG_GROUPS: Array<{ allergyKeywords: string[]; drugKeywords: string[]; warning: string }> = [
    {
        allergyKeywords: ["penicillin", "amoxicillin", "augmentin", "beta-lactam"],
        drugKeywords: ["amoxicillin", "augmentin", "ampicillin", "penicillin", "amoxil", "co-amoxiclav"],
        warning: "Beta-lactam / Penicillin allergy conflict",
    },
    {
        allergyKeywords: ["nsaid", "ibuprofen", "brufen", "diclofenac", "naproxen", "aspirin"],
        drugKeywords: ["ibuprofen", "brufen", "diclofenac", "cataflam", "voren", "naproxen", "synflex", "ketorolac", "aspirin", "flurbiprofen", "ansaid"],
        warning: "NSAID / Analgesic allergy conflict",
    },
    {
        allergyKeywords: ["sulfa", "sulfonamide", "cotrimoxazole"],
        drugKeywords: ["septran", "bactrim", "sulfamethoxazole", "trimethoprim"],
        warning: "Sulfonamide allergy conflict",
    },
    {
        allergyKeywords: ["lidocaine", "lignocaine", "local anesthetic"],
        drugKeywords: ["lidocaine", "lignocaine", "xylocaine", "articaine", "septocaine"],
        warning: "Local anesthetic allergy conflict",
    },
    {
        allergyKeywords: ["metronidazole", "flagyl"],
        drugKeywords: ["metronidazole", "flagyl"],
        warning: "Metronidazole allergy conflict",
    },
    {
        allergyKeywords: ["macrolide", "azithromycin", "erythromycin", "clarithromycin"],
        drugKeywords: ["azithromycin", "azomax", "erythromycin", "clarithromycin"],
        warning: "Macrolide antibiotic allergy conflict",
    },
];

export function detectAllergyConflicts(
    entries: PrescriptionEntry[],
    allergies: string[]
): string[] {
    const cleanAllergies = allergies.map((a) => a.trim().toLowerCase()).filter(Boolean);
    if (cleanAllergies.length === 0) return [];

    const warnings = new Set<string>();
    for (const entry of entries) {
        const drug = entry.drug.trim().toLowerCase();
        if (!drug) continue;

        for (const allergy of cleanAllergies) {
            if (drug.includes(allergy) || allergy.includes(drug)) {
                warnings.add(`${entry.drug} matches recorded allergy "${allergy}"`);
            }
        }
        for (const group of ALLERGY_DRUG_GROUPS) {
            const hasAllergy = cleanAllergies.some((a) => group.allergyKeywords.some((k) => a.includes(k)));
            const hasDrug = group.drugKeywords.some((k) => drug.includes(k));
            if (hasAllergy && hasDrug) {
                warnings.add(`${entry.drug}: ${group.warning}`);
            }
        }
    }
    return Array.from(warnings);
}
