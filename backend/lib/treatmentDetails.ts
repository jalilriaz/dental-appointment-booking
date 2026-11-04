export interface ExpectationStep {
  step: number;
  title: string;
  description: string;
}

export interface TreatmentFAQ {
  question: string;
  answer: string;
}

export interface TreatmentDetailData {
  categoryName: string;
  expectations: ExpectationStep[];
  faqs: TreatmentFAQ[];
}

export function getTreatmentExpectations(name: string, customInstructions?: string | null): TreatmentDetailData {
  const n = name.toLowerCase();

  // ── 1. Implants ──────────────────────────────────────────
  if (n.includes("implant")) {
    const isGerman = n.includes("german");
    const isAmerican = n.includes("american");
    const isKorean = n.includes("korean");

    const brandNote = isGerman
      ? "German engineering with high-grade titanium and rapid osseointegration."
      : isAmerican
        ? "American FDA-approved implant system with exceptional lifetime durability."
        : isKorean
          ? "Cost-effective Korean implant system with proven clinical success."
          : "Medical-grade biocompatible titanium implant system.";

    return {
      categoryName: "Dental Implantology",
      expectations: [
        {
          step: 1,
          title: "3D CBCT Scan & Bone Assessment",
          description: "High-resolution digital 3D imaging to evaluate jawbone density, nerve paths, and precisely plan implant angulation.",
        },
        {
          step: 2,
          title: "Precision Fixture Placement",
          description: `Minimally invasive surgical placement of the titanium fixture under local anesthesia (${brandNote}).`,
        },
        {
          step: 3,
          title: "Osseointegration (Bone Fusion)",
          description: "A healing period of 8-12 weeks where natural bone permanently fuses with the implant post, creating a rock-solid root.",
        },
        {
          step: 4,
          title: "Abutment & Custom Crown Fitting",
          description: "Placement of the connector and a bespoke zirconia/ceramic crown sculpted to match your natural teeth in shade and bite.",
        },
      ],
      faqs: [
        {
          question: "Is dental implant surgery painful?",
          answer: "No. The procedure is performed under local anesthesia, so you will feel gentle pressure but no pain. Post-op tenderness is mild and easily managed with prescribed analgesics.",
        },
        {
          question: "How long do dental implants last?",
          answer: "Dental implants have a 95-98% success rate and are considered a permanent, lifetime tooth replacement solution when maintained with good oral hygiene.",
        },
        {
          question: "How soon can I return to work after implant placement?",
          answer: "Most patients return to regular daily activities and work within 24 to 48 hours following the fixture placement.",
        },
        {
          question: "Can anyone get a dental implant?",
          answer: "Most healthy adults are candidates. If bone density is low due to long-missing teeth, a minor bone graft can easily rebuild the foundation.",
        },
      ],
    };
  }

  // ── 2. Teeth Whitening ───────────────────────────────────
  if (n.includes("whiten") || n.includes("whitening")) {
    const isLaser = n.includes("laser");

    return {
      categoryName: "Cosmetic Teeth Whitening",
      expectations: [
        {
          step: 1,
          title: "Shade Analysis & Surface Polish",
          description: "Measuring your initial tooth shade on the standard VITA guide and performing a gentle polish to remove extrinsic surface film.",
        },
        {
          step: 2,
          title: "Gingival Barrier Protection",
          description: "Applying a light-cured resin barrier over your gums and lips to completely shield soft oral tissues from the active gel.",
        },
        {
          step: 3,
          title: isLaser ? "Laser-Activated Gel Application" : "Professional Gel Activation",
          description: isLaser
            ? "Applying dental-grade whitening gel activated with targeted laser wavelengths in 15-minute intervals to break deep pigments."
            : "Applying medical-grade whitening formula in timed cycles for maximum enamel brightening with zero abrasion.",
        },
        {
          step: 4,
          title: "Desensitizing Glaze & Shade Reveal",
          description: "Applying a fluoride-infused post-treatment glaze to prevent sensitivity and comparing your final shade (up to 8 shades brighter).",
        },
      ],
      faqs: [
        {
          question: "Will whitening damage or weaken my enamel?",
          answer: "No. Professional in-clinic whitening oxidizes internal pigment molecules without etching or eroding tooth enamel. It is completely safe under dentist supervision.",
        },
        {
          question: "Will I experience sensitive teeth after whitening?",
          answer: "Mild, temporary sensitivity can occur for 24-48 hours in some patients. We apply a protective desensitizing agent immediately after treatment to minimize this.",
        },
        {
          question: "Can I drink tea or coffee right after treatment?",
          answer: "We recommend following the 'White Diet' (avoiding tea, coffee, colas, curry, and smoking) for 48 hours while enamel pores rehydrate.",
        },
        {
          question: "How long will my whitening results last?",
          answer: "Results typically last 1 to 2 years depending on your dietary habits and oral hygiene routine. Routine touch-ups keep it bright.",
        },
      ],
    };
  }

  // ── 3. Scaling & Cleaning ────────────────────────────────
  if (n.includes("scal") || n.includes("clean") || n.includes("polish")) {
    const isDeep = n.includes("deep");

    return {
      categoryName: "Preventative Periodontics",
      expectations: [
        {
          step: 1,
          title: "Periodontal Gum & Plaque Exam",
          description: "Checking gum pocket depths and identifying tartar (calculus) accumulation along enamel and gum margins.",
        },
        {
          step: 2,
          title: isDeep ? "Subgingival Deep Scaling & Root Planing" : "Ultrasonic Calculus Debridement",
          description: isDeep
            ? "Thorough deep cleaning below the gumline using specialized micro-curettes to smooth root surfaces and eradicate periodontal pockets."
            : "High-frequency ultrasonic vibrations with gentle water spray to dislodge hardened plaque and tartar without touching healthy tooth structure.",
        },
        {
          step: 3,
          title: "Prophy Air-Polishing",
          description: "Polishing with fine prophy paste to eliminate stubborn external tea, coffee, and tobacco stains for a silky-smooth finish.",
        },
        {
          step: 4,
          title: "Antiseptic Flush & Fluoride Rinse",
          description: "Irrigating gum sulcus with therapeutic antiseptic rinse to soothe gums, promote healing, and leave fresh breath.",
        },
      ],
      faqs: [
        {
          question: "Does scaling create gaps between teeth or weaken enamel?",
          answer: "A common myth! Scaling does not create gaps or damage enamel. The spaces you feel were previously clogged with bacterial tartar that had caused gum recession.",
        },
        {
          question: "How often should I get scaling and polishing done?",
          answer: "Dentists recommend professional scaling every 6 months to maintain healthy gums and prevent periodontal disease.",
        },
        {
          question: "Will my gums bleed during or after scaling?",
          answer: "If your gums are inflamed (gingivitis), minor bleeding can happen during cleaning. Once the tartar is removed, gums heal and bleeding stops permanently.",
        },
        {
          question: "Is dental scaling painful?",
          answer: "Routine scaling causes minimal sensation (slight vibration and cool water). For deep subgingival scaling, a topical numbing gel is used for total comfort.",
        },
      ],
    };
  }

  // ── 4. Root Canal Treatment (RCT) ────────────────────────
  if (n.includes("rct") || n.includes("root") || n.includes("canal")) {
    const isMulti = n.includes("multi");

    return {
      categoryName: "Endodontic Therapy",
      expectations: [
        {
          step: 1,
          title: "Digital X-Ray & Complete Numbing",
          description: "Digital radiography to map root anatomy, followed by profound local anesthesia so you feel zero discomfort throughout.",
        },
        {
          step: 2,
          title: "Pulp Chamber Access & Infection Removal",
          description: "Isolating the tooth with a sterile rubber dam, opening access, and extracting diseased nerve/pulp tissue to stop pain instantly.",
        },
        {
          step: 3,
          title: isMulti ? "Multi-Canal Mechanical Shaping" : "Precision Canal Disinfection",
          description: isMulti
            ? "Using flexible rotary nickel-titanium files to cleanse, widen, and irrigate all 3 to 4 intricate molar root canals with antibacterial irrigants."
            : "Cleaning and widening the canal with motorized rotary instruments and antibacterial irrigants to eradicate all microbial bacteria.",
        },
        {
          step: 4,
          title: "Biocompatible Hermetic Seal (Gutta-Percha)",
          description: "Filling the clean canals with biocompatible gutta-percha and sealing with a permanent adhesive core restoration.",
        },
      ],
      faqs: [
        {
          question: "Does a root canal hurt?",
          answer: "No. Modern root canal treatment relieves pain rather than causing it. With effective local anesthesia, the procedure is as comfortable as getting a standard filling.",
        },
        {
          question: "Why do I need a crown after a root canal?",
          answer: "Once the infected nerve is removed, the tooth loses moisture and becomes brittle under heavy chewing forces. A crown reinforces the tooth and prevents fractures.",
        },
        {
          question: "How many visits does a root canal take?",
          answer: "Many uncomplicated single-canal cases can be completed in a single visit (45-60 mins). Complex multi-canal infections may require 2 visits for optimal disinfection.",
        },
        {
          question: "What can I eat right after the procedure?",
          answer: "Wait until local anesthesia numbness wears off completely before eating. Avoid biting hard foods on the treated tooth until the final crown is placed.",
        },
      ],
    };
  }

  // ── 5. Extractions ───────────────────────────────────────
  if (n.includes("extract")) {
    const isWisdom = n.includes("wisdom");
    const isSurgical = n.includes("surgical") || isWisdom;

    return {
      categoryName: "Oral Surgery & Exodontia",
      expectations: [
        {
          step: 1,
          title: "Radiographic Nerve & Root Assessment",
          description: "Careful examination of root morphology, bone anchoring, and alveolar nerve proximity to plan an atraumatic extraction.",
        },
        {
          step: 2,
          title: "Profound Local Anesthesia",
          description: "Administering local numbing around the tooth and gum. We test thoroughly before starting to ensure total numbness.",
        },
        {
          step: 3,
          title: isSurgical ? "Atraumatic Sectioning & Removal" : "Gentle Luxation & Delivery",
          description: isSurgical
            ? "Gentle sectioning of impacted tooth crown and roots to remove them piece by piece with minimal pressure on jawbone and tissues."
            : "Gradual, gentle expansion of the tooth socket to release the periodontal fibers and smoothly remove the tooth intact.",
        },
        {
          step: 4,
          title: "Hemostasis, Suture & Recovery Protocol",
          description: "Placing sterile sterile gauze (and dissolvable sutures if surgical), with detailed written guidelines to ensure rapid healing.",
        },
      ],
      faqs: [
        {
          question: "How do I prevent 'Dry Socket'?",
          answer: "Do not smoke, do not drink through a straw, and avoid vigorous rinsing or spitting for the first 48 hours to protect the natural blood clot in the socket.",
        },
        {
          question: "When can I eat solid foods again?",
          answer: "Stick to soft, cool foods (yogurt, soup, ice cream, mashed potatoes) for the first 24-48 hours. Chew on the opposite side of your mouth.",
        },
        {
          question: "Is wisdom tooth extraction painful?",
          answer: "You won't feel pain during the surgery due to local anesthesia. Mild swelling and tenderness peak around day 2 and subside quickly with pain medications and ice packs.",
        },
        {
          question: "How long does socket recovery take?",
          answer: "Soft tissue heals significantly within 7 to 10 days, while the underlying bone completely regenerates over the following weeks.",
        },
      ],
    };
  }

  // ── 6. Orthodontics (Braces & Aligners) ───────────────────
  if (n.includes("brace") || n.includes("aligner") || n.includes("align")) {
    const isAligner = n.includes("aligner") || n.includes("invisible");
    const isCeramic = n.includes("ceramic");

    return {
      categoryName: "Orthodontics & Dentofacial Alignment",
      expectations: [
        {
          step: 1,
          title: "3D Digital Scan & Smile Simulation",
          description: "Detailed 3D intraoral scan and photographs to map your malocclusion and view a 3D digital simulation of your finished smile.",
        },
        {
          step: 2,
          title: isAligner ? "Custom Aligner Tray Delivery" : "Precision Bracket Bonding",
          description: isAligner
            ? "Fitting your initial series of clear, medical-grade thermoplastic aligners and placing tiny tooth-colored attachments."
            : isCeramic
              ? "Meticulous bonding of aesthetic, clear ceramic brackets that match your natural enamel, threaded with archwire."
              : "Precision bonding of high-grade stainless steel brackets and comfortable flexible archwires.",
        },
        {
          step: 3,
          title: isAligner ? "Progressive Tray Switches (Every 1-2 Weeks)" : "Periodic Archwire Adjustments",
          description: isAligner
            ? "Progressing through numbered aligner sets at home with checkups every 6-8 weeks to monitor tooth movement."
            : "Routine visits every 4-6 weeks to tighten archwires and replace elastics as your teeth gently shift into place.",
        },
        {
          step: 4,
          title: "Debonding & Retainer Protocol",
          description: "Removing brackets or finishing trays, polishing enamel, and fitting clear retainers to hold your new smile permanently in position.",
        },
      ],
      faqs: [
        {
          question: isAligner ? "How many hours a day must I wear aligners?" : "Will wearing braces hurt?",
          answer: isAligner
            ? "Aligners must be worn 20 to 22 hours daily, removed only for eating, drinking hot/colored beverages, brushing, and flossing."
            : "You will feel pressure and mild tenderness for 3-5 days after initial placement and wire adjustments. Soft wax prevents cheek irritation.",
        },
        {
          question: "How long does overall orthodontic treatment take?",
          answer: "Treatment typically ranges from 6 to 18 months depending on complexity and patient compliance with appointments or wear time.",
        },
        {
          question: "Will braces or aligners affect how I speak?",
          answer: "A very slight lisp may occur for the first 2-3 days as your tongue adapts. Your speech returns to completely normal shortly after.",
        },
        {
          question: "Do I need retainers after my teeth are straight?",
          answer: "Yes, retainers are essential for any orthodontic patient to prevent teeth from naturally drifting back over time.",
        },
      ],
    };
  }

  // ── 7. Veneers & Lumineers ───────────────────────────────
  if (n.includes("veneer") || n.includes("lumineer")) {
    const isLumineer = n.includes("lumineer");
    const isComposite = n.includes("composite");

    return {
      categoryName: "Aesthetic Prosthodontics",
      expectations: [
        {
          step: 1,
          title: "Digital Smile Design Consultation",
          description: "Facial symmetry analysis, shade selection, and mock-up preview to design teeth proportions, shape, and length.",
        },
        {
          step: 2,
          title: isLumineer
            ? "No-Prep Digital Precision Scan"
            : isComposite
              ? "Direct Tooth Surface Conditioning"
              : "Conservative Enamel Sculpting",
          description: isLumineer
            ? "Zero or ultra-minimal enamel shaving. We capture microscopic 3D digital impressions sent to the master lab."
            : isComposite
              ? "Micro-etching the tooth surface with zero extensive drill work, ready for direct artistic layering."
              : "Ultra-conservative removal of a fraction of a millimeter (0.3-0.5mm) of outer enamel to accommodate the ceramic shell.",
        },
        {
          step: 3,
          title: isComposite ? "Direct Artistic Sculpting" : "Custom Ceramic Fabrication",
          description: isComposite
            ? "Hand-layering premium micro-hybrid composite resin directly onto your tooth, cured with high-intensity light in a single visit."
            : "Master dental technicians handcraft custom porcelain or Lumineer shells with natural translucency and depth.",
        },
        {
          step: 4,
          title: "Adhesive Cementation & High-Gloss Polish",
          description: "Permanent resin bonding under dental isolation, finished with diamond-paste polishing for a radiant, lifelike shine.",
        },
      ],
      faqs: [
        {
          question: isLumineer ? "Do Lumineers require shaving my teeth?" : "Does getting veneers ruin your natural teeth?",
          answer: isLumineer
            ? "Lumineers are ultra-thin (approx. 0.2mm, like contact lenses) and typically require zero to minimal enamel shaving, making the procedure reversible."
            : "No. Modern veneers require only ultra-conservative shaving (less than 0.5mm). Your natural tooth structure remains strong and intact underneath.",
        },
        {
          question: "Can porcelain veneers stain from coffee or smoking?",
          answer: "High-grade porcelain and Lumineers are non-porous and highly resistant to stains from coffee, tea, red wine, and tobacco.",
        },
        {
          question: "How long do veneers last?",
          answer: "Porcelain veneers and Lumineers last 10 to 15+ years with regular brushing, flossing, and semi-annual cleanings. Composite veneers typically last 5-7 years.",
        },
        {
          question: "Can I bite and eat normally with veneers?",
          answer: "Yes. Once fully bonded, veneers function like natural enamel. We recommend avoiding opening bottle caps or chewing ice directly with your front teeth.",
        },
      ],
    };
  }

  // ── 8. Default Fallback ──────────────────────────────────
  return {
    categoryName: "General Dental Care",
    expectations: [
      {
        step: 1,
        title: "Clinical Exam & Diagnostics",
        description: "Thorough visual examination and digital diagnostic assessment to determine the best treatment course for your oral health.",
      },
      {
        step: 2,
        title: "Personalized Procedure",
        description: "Gentle, precise dental treatment performed with modern tools and local numbing to ensure your complete comfort.",
      },
      {
        step: 3,
        title: "Post-Treatment Care & Guidance",
        description: "Clear verbal and written aftercare instructions to support fast healing, long-lasting results, and optimal oral hygiene.",
      },
    ],
    faqs: [
      {
        question: "Is this treatment painful?",
        answer: "We prioritize patient comfort above all else. Modern gentle techniques and effective local anesthesia ensure virtually painless appointments.",
      },
      {
        question: "How many visits are typically required?",
        answer: "Most routine dental procedures are completed in a single comfortable visit. If your case requires follow-up, our team will coordinate convenient appointments.",
      },
      {
        question: "How can I maintain the best results after treatment?",
        answer: customInstructions || "Maintain consistent twice-daily brushing, daily flossing, and visit Elite Dental Centre every 6 months for a routine checkup.",
      },
    ],
  };
}
