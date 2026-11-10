export interface ExpectationStep {
  step: number;
  title: string;
  description?: string;
  desc?: string;
}

export interface TreatmentFAQ {
  question: string;
  answer: string;
}

export interface PreCareItem {
  title: string;
  desc: string;
}

export interface PostCarePhase {
  phase: string;
  title: string;
  instructions: string[];
}

export interface TreatmentDetailData {
  categoryName: string;
  summaryBadge: string;
  preCare: PreCareItem[];
  expectations: ExpectationStep[];
  effectsAndSensations: {
    during: string;
    immediateAfter: string;
    anesthesiaType: string;
  };
  postCare: PostCarePhase[];
  clinicalBenefits: string[];
  galleryImages: string[];
  faqs: TreatmentFAQ[];
}

export function getTreatmentExpectations(name: string, customInstructions?: string | null): TreatmentDetailData {
  const n = name.toLowerCase();

  // ── 1. Scaling & Cleaning (Preventative Periodontics) ─────────────────
  if (n.includes("scal") || n.includes("clean") || n.includes("polish")) {
    const isDeep = n.includes("deep");
    const isFull = n.includes("full");

    return {
      categoryName: "Preventative Periodontics",
      summaryBadge: isDeep ? "Subgingival Deep Scaling & Root Planing" : "Ultrasonic Prophylaxis",
      preCare: [
        {
          title: "Eat a Light Meal 1 Hour Prior",
          desc: "Have a light, nutritious meal before your appointment to keep blood sugar stable during the cleaning.",
        },
        {
          title: "List Current Medical Conditions & Blood Thinners",
          desc: "Inform our surgeon if you take aspirin, anticoagulants, or have artificial heart valves or joint replacements.",
        },
        {
          title: "Pre-Procedural Antiseptic Rinse",
          desc: "Our nurse will provide a 1-minute chlorhexidine mouthrinse at chairside to reduce oral bacterial aerosols by 99%.",
        },
      ],
      expectations: [
        {
          step: 1,
          title: "Periodontal Gum Pocket & Tartar Assessment",
          desc: "Mapping gum sulcus depths and identifying subgingival calculus (hardened tartar) using digital magnification loupes.",
        },
        {
          step: 2,
          title: isDeep ? "Subgingival Ultrasonic Scaling & Root Planing" : "Supragingival Ultrasonic Calculus Removal",
          desc: isDeep
            ? "Gentle ultrasonic micro-tips and fine curettes reach deep into periodontal pockets to eliminate bacterial bio-film and smooth root surfaces."
            : "High-frequency ultrasonic vibrations dislodge stubborn tartar deposits from enamel margins while cool sterile water flushes the area.",
        },
        {
          step: 3,
          title: "Prophy-Jet Air Polishing",
          desc: "Polishing all enamel surfaces with fine prophy paste to lift external tea, coffee, and nicotine stains, leaving teeth silky-smooth.",
        },
        {
          step: 4,
          title: "Therapeutic Subgingival Irrigation & Fluoride",
          desc: "Flushing pockets with anti-microbial solution to soothe inflamed gingiva and applying chairside fluoride to seal exposed dentinal tubules.",
        },
      ],
      effectsAndSensations: {
        during: "Mild vibration with cool sterile water mist. Deep scaling uses topical anesthetic gel so you feel pressure but zero sharp pain.",
        immediateAfter: "Teeth will feel exceptionally clean and slick. Slight gum tenderness or transient cold sensitivity is normal for 24-48 hours.",
        anesthesiaType: isDeep ? "Computerized Topical Numbing Gel & Local Block" : "No Injection Required / Topical Gel on Request",
      },
      postCare: [
        {
          phase: "First 2 to 4 Hours",
          title: "Immediate Protection",
          instructions: [
            "Avoid eating until any local numbness has completely worn off to prevent accidentally biting cheeks or tongue.",
            "Avoid extremely hot, acidic, or icy drinks that could trigger temporary dentin sensitivity.",
          ],
        },
        {
          phase: "Days 1 to 3",
          title: "Gingival Healing",
          instructions: [
            "Rinse gently with warm saltwater (1/2 tsp salt in 1 cup warm water) 2-3 times daily after meals.",
            "Brush gently with an ultra-soft toothbrush; do not scrub vigorously along tender gumlines.",
            "Use potassium-nitrate desensitizing toothpaste if you experience mild thermal sensitivity.",
          ],
        },
        {
          phase: "Long-Term",
          title: "Periodontal Longevity",
          instructions: [
            "Floss daily or use an interdental brush to prevent plaque from calcifying into new calculus.",
            "Schedule maintenance scaling every 6 months to prevent irreversible bone loss and gingivitis.",
          ],
        },
      ],
      clinicalBenefits: [
        "Eliminates chronic halitosis (bad breath) by removing anaerobic bacterial colonies.",
        "Arrests bleeding gums and prevents progression into irreversible periodontitis and bone loss.",
        "Smooths root surfaces, encouraging receded gums to reattach snugly to teeth.",
        "Restores natural tooth brightness by stripping away embedded dark dietary stains.",
      ],
      galleryImages: [
        "/images/services/deep_scaling.png",
        "/images/services/basic_scaling.png",
        "/images/services/full_mouth_scaling.png",
      ],
      faqs: [
        {
          question: "Does scaling create gaps between teeth or weaken enamel?",
          answer: "A common myth! Scaling does not grind enamel or create gaps. The spaces you feel were previously clogged with calcified tartar that caused your gums to recede. Removing the tartar allows your gums to heal.",
        },
        {
          question: "How long does the scaling procedure take?",
          answer: "Routine scaling takes 30-40 minutes. Comprehensive deep subgingival scaling takes approximately 45-60 minutes depending on tartar accumulation.",
        },
        {
          question: "Why do my gums bleed during cleaning?",
          answer: "Inflamed, irritated gums (gingivitis) bleed easily during tartar debridement. Once the bacterial tartar is cleared, your gums heal within 48-72 hours and stop bleeding completely.",
        },
        {
          question: "How often should I get professional scaling done?",
          answer: "International dental guidelines recommend professional scaling and polishing every 6 months for adults to prevent gum disease.",
        },
      ],
    };
  }

  // ── 2. Implants ──────────────────────────────────────────
  if (n.includes("implant")) {
    const isGerman = n.includes("german");
    const isAmerican = n.includes("american");
    const isKorean = n.includes("korean");

    const brand = isGerman ? "German Medentis / ICX" : isAmerican ? "American Zimmer Biomet" : isKorean ? "Korean Osstem / MegaGen" : "Medical-Grade Biocompatible Titanium";

    return {
      categoryName: "Advanced Dental Implantology",
      summaryBadge: `${brand} Titanium Fixture`,
      preCare: [
        {
          title: "3D CBCT Radiographic Bone Scan",
          desc: "A 3D cone-beam computed tomography scan is required to map bone volume, bone density, and vital nerve canals with sub-millimeter precision.",
        },
        {
          title: "Routine Medical History & Blood Profile",
          desc: "Inform us of any cardiovascular medications, bisphosphonates, or diabetes (HbA1c should ideally be below 7.0 for optimal osseointegration).",
        },
        {
          title: "Pre-Operative Antibiotic Prophylaxis",
          desc: "Our surgeon may prescribe a pre-procedural antibiotic dose to be taken 1 hour before surgery to ensure a sterile implant bed.",
        },
      ],
      expectations: [
        {
          step: 1,
          title: "Computer-Guided Surgical Planning",
          desc: "Designing the exact 3D entry angle and depth using surgical template software to avoid anatomical nerves and sinus cavities.",
        },
        {
          step: 2,
          title: "Atraumatic Osteotomy & Fixture Placement",
          desc: `Precision preparation of the titanium osteotomy site under continuous saline cooling, inserting the ${brand} fixture with high initial stability.`,
        },
        {
          step: 3,
          title: "Osseointegration (Bone Fusion)",
          desc: "A biological healing interval of 8-12 weeks where natural trabecular bone cells fuse directly to the microporous titanium surface.",
        },
        {
          step: 4,
          title: "Custom Abutment & Zirconia Crown Delivery",
          desc: "Affixing the custom abutment and securing a precision-milled monolithic zirconia crown matched in shade and occlusion.",
        },
      ],
      effectsAndSensations: {
        during: "Zero sharp pain. You will hear surgical motor sounds and feel gentle firm pressure during placement. Sedation is available for nervous patients.",
        immediateAfter: "Mild post-operative tenderness and slight cheek swelling peaking at 48 hours, fully controlled with prescribed pain relievers.",
        anesthesiaType: "Profound Local Infiltration & Computerized Nerve Block",
      },
      postCare: [
        {
          phase: "Day 1 (First 24 Hours)",
          title: "Protect the Surgical Site",
          instructions: [
            "Bite firmly on the sterile gauze pack for 45-60 minutes after leaving the operatory.",
            "Do NOT rinse, spit forcefully, or drink through a straw. Apply ice packs externally to cheek in 15-minute intervals.",
            "Eat cool, soft foods (smoothies, yogurt, lukewarm soup) and do not chew on the implant side.",
          ],
        },
        {
          phase: "Days 2 to 7",
          title: "Gentle Healing Protocol",
          instructions: [
            "Begin gentle warm saltwater rinses 3-4 times daily after meals to keep the surgical site clean.",
            "Take prescribed antibiotics and anti-inflammatory analgesics as directed until completed.",
            "Brush remaining teeth normally, but avoid touching the suture line with toothbrush bristles.",
          ],
        },
        {
          phase: "Weeks 2 to 12",
          title: "Osseointegration Maintenance",
          instructions: [
            "Avoid heavy pressure or chewing hard nuts/ice directly over the healing abutment.",
            "Attend the 2-week suture check and the 8-week stability confirmation scan.",
          ],
        },
      ],
      clinicalBenefits: [
        "Permanent, lifelong tooth replacement with a 98% clinical success rate.",
        "Prevents facial bone resorption and premature aging caused by missing root stimulation.",
        "Zero damage or shaving required on neighboring healthy natural teeth (unlike dental bridges).",
        "Restores 100% natural chewing efficiency and natural aesthetic smile confidence.",
      ],
      galleryImages: [
        "/images/services/american_implant.png",
        "/images/services/german_implant.png",
        "/images/services/korean_implant.png",
      ],
      faqs: [
        {
          question: "Is dental implant surgery painful?",
          answer: "No. With profound local anesthesia, you feel no pain during the procedure. Most patients report that getting an implant is much easier and less uncomfortable than having a tooth extracted.",
        },
        {
          question: "How long do dental implants last?",
          answer: "Dental implants are designed to be a permanent lifetime solution. With regular oral hygiene and routine checkups, titanium implants last a lifetime.",
        },
        {
          question: "What if I do not have enough jawbone for an implant?",
          answer: "If bone loss has occurred from missing teeth, our surgeons can perform bone grafting or sinus lifting at the same time to create a rock-solid foundation.",
        },
        {
          question: "Will I be left without a tooth during the healing phase?",
          answer: "Never! We place a temporary aesthetic crown or flipper so you can smile, speak, and socialize with total confidence throughout the osseointegration period.",
        },
      ],
    };
  }

  // ── 3. Teeth Whitening ───────────────────────────────────
  if (n.includes("whiten")) {
    const isLaser = n.includes("laser");

    return {
      categoryName: "Cosmetic Teeth Whitening",
      summaryBadge: isLaser ? "Diode Laser Accelerated Whitening" : "Medical-Grade Bleaching",
      preCare: [
        {
          title: "Pre-Whitening Scaling & Polish",
          desc: "For optimal, uniform whitening penetration, we recommend getting a light prophy polish within 7 days prior to remove extrinsic plaque film.",
        },
        {
          title: "Pre-Op Shade Mapping",
          desc: "Your doctor will document your initial tooth shade on the international VITA Classical scale with chairside digital photos.",
        },
        {
          title: "Desensitizing Toothpaste Preparation",
          desc: "If you have sensitive teeth, brush with potassium nitrate toothpaste for 3 days prior to your appointment.",
        },
      ],
      expectations: [
        {
          step: 1,
          title: "Lip Retraction & Gingival Barrier Application",
          desc: "Carefully isolating lips and applying a liquid light-cured resin barrier over your gum margins to shield soft tissues completely.",
        },
        {
          step: 2,
          title: "Medical Bleaching Gel Application",
          desc: "Applying buffered hydrogen peroxide whitening gel (35-40%) evenly across the aesthetic smile zone (upper and lower 8 teeth).",
        },
        {
          step: 3,
          title: isLaser ? "Diode Laser Photothermal Activation" : "LED High-Intensity Activation",
          desc: "Activating the gel with focused laser light in 15-minute cycles, breaking deep chromophore stain bonds within enamel crystals.",
        },
        {
          step: 4,
          title: "Post-Treatment Enamel Remineralization",
          desc: "Suctioning off the gel, removing the gum dam, and applying topical amorphous calcium phosphate (ACP) to nourish enamel and eliminate sensitivity.",
        },
      ],
      effectsAndSensations: {
        during: "Warmth on tooth surface. You may experience occasional brief minor 'zingers' (temporary pulpal flashes) during the laser cycle.",
        immediateAfter: "Instant noticeable brightness (4 to 8 shades lighter). Mild transient thermal sensitivity for 24 hours.",
        anesthesiaType: "Zero Injection / Topical Barrier Isolation",
      },
      postCare: [
        {
          phase: "First 48 Hours",
          title: "The Strict 'White Diet'",
          instructions: [
            "Enamel pores remain open for 48 hours. Avoid all dark staining food & drinks: coffee, tea, red wine, soy sauce, curries, berries, and tobacco.",
            "Stick to light-colored foods: milk, water, rice, pasta, plain chicken, egg whites, and bread.",
            "Do not use colored mouthwashes (blue/red/green).",
          ],
        },
        {
          phase: "First Week",
          title: "Enamel Stabilization",
          instructions: [
            "Use a desensitizing fluoridated toothpaste if teeth react to cold liquids.",
            "Brush gently with an ultra-soft brush.",
          ],
        },
        {
          phase: "Maintenance",
          title: "Sustained Radiance",
          instructions: [
            "Drink staining beverages with a straw when possible.",
            "Top-up maintenance cleanings every 6-12 months keep your smile radiant for years.",
          ],
        },
      ],
      clinicalBenefits: [
        "Lightens teeth up to 6-8 shades in a single 60-minute chairside session.",
        "Non-invasive cosmetic enhancement with zero tooth structure removal.",
        "Laser-buffered gel protects tooth enamel and neutralizes pH to prevent erosion.",
        "Instantly enhances facial aesthetics, boosting personal and professional self-confidence.",
      ],
      galleryImages: [
        "/images/services/laser_whitening.png",
        "/images/services/american_whitening.png",
        "/images/services/german_whitening.png",
      ],
      faqs: [
        {
          question: "Does laser whitening damage natural tooth enamel?",
          answer: "No. Professional dental whitening uses buffered formulations that oxidize organic stain molecules inside microscopic enamel pores without altering the mineral structure.",
        },
        {
          question: "How long do professional whitening results last?",
          answer: "Results typically last 1 to 3 years depending on dietary habits (coffee, tea, smoking) and daily oral hygiene routine.",
        },
        {
          question: "Will whitening work on fillings, crowns, or veneers?",
          answer: "Whitening gels only lighten natural tooth enamel. Synthetic porcelain or composite restorations do not change shade and may need replacement if you wish them to match your brighter smile.",
        },
        {
          question: "Will I experience pain or tooth sensitivity?",
          answer: "Some patients feel mild thermal sensitivity for 12 to 24 hours post-treatment. We apply chairside remineralizing desensitizing treatment immediately after to ensure maximum comfort.",
        },
      ],
    };
  }

  // ── 4. Root Canal Treatment (RCT) ────────────────────────
  if (n.includes("rct") || n.includes("root") || n.includes("canal")) {
    const isMulti = n.includes("multi");

    return {
      categoryName: "Endodontic Microsurgery",
      summaryBadge: isMulti ? "Multi-Canal Molar Endodontics" : "Single-Canal Endodontics",
      preCare: [
        {
          title: "Pre-Operative Digital Periapical Radiograph",
          desc: "High-definition digital X-rays to assess root canal curvature, canal length, and periapical bone lesions.",
        },
        {
          title: "Medication & Pain History",
          desc: "Inform us if you are experiencing spontaneous night pain, swelling, or have taken analgesics in the preceding 6 hours.",
        },
        {
          title: "Eat Before Your Appointment",
          desc: "Please have a normal meal before coming in, as you will need to wait a few hours after the procedure before eating.",
        },
      ],
      expectations: [
        {
          step: 1,
          title: "Targeted Local Anesthesia & Rubber Dam Isolation",
          desc: "Delivering profound painless local anesthesia and placing a hygienic rubber dam to isolate the tooth from oral saliva bacteria.",
        },
        {
          step: 2,
          title: "Micro-Access & Infected Pulp Debridement",
          desc: "Opening a tiny conservative access cavity to reach the pulp chamber, extracting diseased inflamed nerve tissue to extinguish pain instantly.",
        },
        {
          step: 3,
          title: isMulti ? "Motorized Rotary Multi-Canal Shaping" : "Rotary Canal Shaping & Ultrasonic Irrigation",
          desc: "Cleaning, enlarging, and disinfecting delicate root canals using flexible nickel-titanium rotary files and antibacterial irrigants.",
        },
        {
          step: 4,
          title: "Hermetic Biocompatible Gutta-Percha Seal",
          desc: "Filling and hermetically sealing the cleaned root canals with biocompatible gutta-percha points and placing a strong restorative core.",
        },
      ],
      effectsAndSensations: {
        during: "Zero pain. You will feel jaw resting pressure and hear rotary instrumentation sounds, but the tooth is 100% numb.",
        immediateAfter: "The acute pre-treatment throbbing pain will be gone. Mild soreness in the surrounding jaw ligament for 2-3 days when biting.",
        anesthesiaType: "Profound Local Infiltration / Mandibular Nerve Block",
      },
      postCare: [
        {
          phase: "Immediate (Hours 1 to 4)",
          title: "Numbness Precautions",
          instructions: [
            "Wait until lips and tongue are fully awake before chewing to avoid soft tissue bites.",
            "Take prescribed pain reliever before numbness completely subsides.",
          ],
        },
        {
          phase: "Days 1 to 5",
          title: "Temporary Protection",
          instructions: [
            "Do not chew hard, crunchy, or sticky foods on the treated side until the permanent crown is placed.",
            "Brush and floss gently around the temporary filling.",
          ],
        },
        {
          phase: "Week 2",
          title: "Permanent Crown Reinforcement",
          instructions: [
            "Schedule your crown impression appointment. A dental crown is mandatory on root-treated molars to prevent fractures.",
          ],
        },
      ],
      clinicalBenefits: [
        "Permanently relieves excruciating dental toothache and eradicates internal bacterial infections.",
        "Saves your natural biological tooth from extraction, maintaining natural jawbone stability.",
        "Protects adjacent teeth from shifting and prevents bone loss in the jaw.",
        "Restores painless biting functionality once protected with a permanent crown.",
      ],
      galleryImages: [
        "/images/services/root_canal.png",
        "/images/services/multi_canal_rct.png",
        "/images/services/single_canal_rct.png",
      ],
      faqs: [
        {
          question: "Does modern root canal treatment hurt?",
          answer: "No! Root canal therapy relieves pain rather than causing it. With modern anesthetics and rotary technology, having a root canal is as comfortable as getting a regular filling.",
        },
        {
          question: "Why is a dental crown necessary after a root canal?",
          answer: "Once the infected nerve and blood supply are removed, the tooth loses moisture and becomes brittle. A permanent zirconia or ceramic crown reinforces the tooth against biting forces.",
        },
        {
          question: "How long does a root-treated tooth last?",
          answer: "With a high-quality crown restoration and regular hygiene, a root-canal-treated tooth can last for the rest of your life.",
        },
      ],
    };
  }

  // ── 5. Veneers & Cosmetic ─────────────────────────────────
  if (n.includes("veneer") || n.includes("lumineer")) {
    const isComposite = n.includes("composite");

    return {
      categoryName: "Aesthetic Cosmetic Dentistry",
      summaryBadge: isComposite ? "Direct Composite Sculpting" : "Porcelain / E-max Veneers",
      preCare: [
        {
          title: "Facial Aesthetics & Smile Design Consultation",
          desc: "Bring reference photos of your desired smile shape and color. We map facial midline, lip mobility, and tooth proportions.",
        },
        {
          title: "Healthy Gingival Foundation",
          desc: "Gums must be free of gingivitis before veneer placement. A routine cleaning may be performed 1 week prior.",
        },
        {
          title: "Pre-Operative Shade Selection",
          desc: "Selecting your target shade on the VITA Bleachguide in natural daylight.",
        },
      ],
      expectations: [
        {
          step: 1,
          title: "Ultra-Conservative Enamel Conditioning",
          desc: isComposite
            ? "Micro-etching the natural enamel surface with zero heavy drill work, creating micro-pores for chemical bonding."
            : "Ultra-conservative enamel preparation (0.3mm to 0.5mm) to create space for wafer-thin porcelain shells.",
        },
        {
          step: 2,
          title: isComposite ? "Hand-Layered Nano-Hybrid Resin" : "Precision 3D Digital Intraoral Scan",
          desc: isComposite
            ? "Artistically hand-layering polychromatic composite resin to recreate natural dentin depth, enamel translucency, and mamelons."
            : "Capturing microscopic digital impressions sent directly to our ceramist laboratory for custom porcelain crafting.",
        },
        {
          step: 3,
          title: isComposite ? "High-Intensity Photo-Polymerization" : "Custom Ceramic Fabrication & Try-In",
          desc: isComposite
            ? "Curing each composite layer with high-intensity LED light to achieve peak flexural strength and natural hardness."
            : "Verifying fit, contact points, and shade harmony against your natural smile with temporary try-in paste.",
        },
        {
          step: 4,
          title: "Adhesive Cementation & Diamond High-Gloss Polish",
          desc: "Permanent adhesive bonding followed by diamond-paste micro-polishing for a radiant, silky finish that mirrors real enamel.",
        },
      ],
      effectsAndSensations: {
        during: "Zero pain. Composite veneers require no injections. Porcelain veneers use mild local numbing for total comfort.",
        immediateAfter: "Instant, breathtaking transformation! Gums may feel slightly tender for 24 hours around margins.",
        anesthesiaType: isComposite ? "No Injections Required" : "Mild Local Anesthetic During Enamel Prep",
      },
      postCare: [
        {
          phase: "First 48 Hours",
          title: "Bonding Maturation",
          instructions: [
            "Stick to soft foods and avoid biting directly into hard objects (apples, nuts, ice).",
            "Avoid dark-colored staining foods and drinks during initial resin settling.",
          ],
        },
        {
          phase: "Ongoing Care",
          title: "Smile Longevity",
          instructions: [
            "Never use teeth as tools to tear open packaging or crack nuts.",
            "Wear a custom nightguard if you have a habit of clenching or grinding teeth at night.",
            "Brush twice daily with non-abrasive gel toothpaste.",
          ],
        },
        {
          phase: "Recalls",
          title: "Annual Professional Polish",
          instructions: [
            "Visit Elite Dental Centre every 6 months for routine cleaning and professional diamond-paste re-polishing.",
          ],
        },
      ],
      clinicalBenefits: [
        "Immediately conceals stubborn deep tetracycline stains, enamel fluorosis, and gaps.",
        "Corrects uneven, chipped, worn, or slightly misaligned front teeth in 1 to 2 sessions.",
        "Preserves 95%+ of natural healthy tooth structure with ultra-conservative techniques.",
        "Delivers natural, radiant translucency that harmonizes with your facial contours.",
      ],
      galleryImages: [
        "/images/services/dental_veneers.png",
        "/images/services/veneers.png",
        "/images/services/dental_crown.png",
      ],
      faqs: [
        {
          question: "Does getting veneers ruin your natural teeth?",
          answer: "No! Modern cosmetic veneers require only minimal enamel prep (a fraction of a millimeter, about 0.3mm to 0.5mm). Your natural tooth structure remains strong and healthy underneath.",
        },
        {
          question: "How long do veneers last?",
          answer: "Porcelain veneers typically last 10 to 15+ years. Composite veneers last 5 to 7 years with good oral hygiene and periodic professional polishing.",
        },
        {
          question: "Can veneers stain like natural teeth?",
          answer: "High-grade porcelain veneers are completely non-porous and highly resistant to coffee, tea, and tobacco stains. Composite veneers may absorb mild surface stains over years but can be re-polished easily.",
        },
      ],
    };
  }

  // ── 6. Braces & Aligners ─────────────────────────────────
  if (n.includes("brace") || n.includes("aligner") || n.includes("orthodontic")) {
    const isAligner = n.includes("aligner") || n.includes("invisible");

    return {
      categoryName: "Orthodontics & Dentofacial Alignment",
      summaryBadge: isAligner ? "Clear Invisible Aligners" : "Precision Aesthetic Braces",
      preCare: [
        {
          title: "Comprehensive Orthodontic Consultation & Cephalometric X-Ray",
          desc: "Assessing jaw relationships, crowding severity, and taking specialized lateral cephalometric and panoramic X-rays.",
        },
        {
          title: "Full Prophylactic Cleaning",
          desc: "Teeth and gums must be 100% plaque-free prior to bracket bonding or 3D aligner digital scanning.",
        },
        {
          title: "Cavity Clearance",
          desc: "Any active tooth decay or defective fillings must be restored before orthodontic movement begins.",
        },
      ],
      expectations: [
        {
          step: 1,
          title: "3D Digital Intraoral Scan & Treatment Simulation",
          desc: "Capturing a continuous 3D digital model of your dental arches and generating a step-by-step computerized simulation of your future smile.",
        },
        {
          step: 2,
          title: isAligner ? "Delivery of Custom Aligner Series" : "Precision Direct Bracket Bonding",
          desc: isAligner
            ? "Placing discrete tooth-colored resin attachments and fitting your first set of clear thermoplastic aligners."
            : "Direct bonding of aesthetic ceramic or metal brackets along the facial axis of each tooth with flexible memory archwires.",
        },
        {
          step: 3,
          title: isAligner ? "Bi-Weekly Aligner Tray Switches" : "Monthly Orthodontic Wire Adjustments",
          desc: isAligner
            ? "Swapping into new numbered aligner trays every 10-14 days at home, with monitoring checkups every 6-8 weeks."
            : "Periodic visits every 4-6 weeks to replace ligature ties, step up archwire tension, and coordinate gentle tooth movements.",
        },
        {
          step: 4,
          title: "Debonding, High-Gloss Polish & Retainer Fitting",
          desc: "Removing attachments or brackets, polishing enamel, and fitting custom clear retainers to preserve straight alignment permanently.",
        },
      ],
      effectsAndSensations: {
        during: "Zero injections. Bracket bonding and aligner fitting are 100% painless.",
        immediateAfter: "Mild aching sensation and tooth tenderness for 3-5 days after wire adjustments or starting new aligner trays as teeth begin gentle movement.",
        anesthesiaType: "Zero Injections Needed / Non-Invasive",
      },
      postCare: [
        {
          phase: "Daily Hygiene",
          title: "Orthodontic Plaque Control",
          instructions: [
            isAligner
              ? "Wear aligners 20 to 22 hours per day; remove ONLY for meals, hot drinks, brushing, and flossing."
              : "Use orthodontic V-trim toothbrushes and interdental proxy brushes around brackets after every meal.",
            "Rinse with fluoridated mouthwash before bed to protect bracket margins from white spot decalcification.",
          ],
        },
        {
          phase: "Dietary Guidance",
          title: "Protecting Appliances",
          instructions: [
            isAligner
              ? "Clean aligners with lukewarm water and soft brush; never use boiling water which warps thermoplastic."
              : "Avoid hard, sticky foods (caramel, popcorn kernels, chewing gum, biting directly into whole apples).",
          ],
        },
        {
          phase: "Retention Phase",
          title: "Lifetime Smile Stability",
          instructions: [
            "Wear your retainers every night as directed to prevent physiological teeth relapse.",
          ],
        },
      ],
      clinicalBenefits: [
        "Permanently corrects severe crowding, crossbites, overbites, and aesthetic spacing.",
        "Significantly improves chewing efficiency and relieves TMJ jaw joint strain.",
        "Straight, aligned teeth are dramatically easier to clean, reducing lifetime risk of cavities and gum disease.",
        "Creates facial harmony and a stunning, symmetrical smile line.",
      ],
      galleryImages: [
        "/images/services/ceramic_braces.png",
        "/images/services/invisible_aligners.png",
        "/images/services/metal_braces.png",
      ],
      faqs: [
        {
          question: isAligner ? "How many hours a day must I wear aligners?" : "Do dental braces hurt?",
          answer: isAligner
            ? "You must wear your clear aligners for 20 to 22 hours every single day for optimal, on-track results. Remove them only when eating or brushing."
            : "Placing braces is painless. For 3-5 days after adjustments, teeth will feel tender when chewing. Mild pain relievers easily manage this initial phase.",
        },
        {
          question: "How long does orthodontic treatment take?",
          answer: "Most cases take between 6 to 18 months depending on malocclusion complexity and patient compliance with appointments and retainer/aligner wear.",
        },
        {
          question: "Will I need to wear a retainer forever?",
          answer: "Yes, retainers worn at night are essential for any orthodontic patient to maintain teeth in their ideal position and prevent natural aging drift.",
        },
      ],
    };
  }

  // ── 7. Extractions ───────────────────────────────────────
  if (n.includes("extract")) {
    const isWisdom = n.includes("wisdom");
    const isSurgical = n.includes("surgical") || isWisdom;

    return {
      categoryName: "Oral Surgery & Exodontia",
      summaryBadge: isWisdom ? "Impacted Wisdom Tooth Surgery" : isSurgical ? "Surgical Atraumatic Extraction" : "Simple Gentle Extraction",
      preCare: [
        {
          title: "Diagnostic Panoramic OPG or CBCT Scan",
          desc: "Mandatory radiographic assessment to determine root curvature, bone density, and proximity to the inferior alveolar nerve canal.",
        },
        {
          title: "Medical & Allergy Clearance",
          desc: "Inform us if you are on blood thinners, have hypertension, or have any medication allergies.",
        },
        {
          title: "Pre-Surgical Nutrition",
          desc: "Eat a normal nutritious meal 1-2 hours before surgery, as you will be restricted to soft cool foods afterward.",
        },
      ],
      expectations: [
        {
          step: 1,
          title: "Profound Local Infiltration & Nerve Block",
          desc: "Administering local numbing with computer-controlled gentle pressure. We test the area thoroughly before starting to ensure 100% numbness.",
        },
        {
          step: 2,
          title: isSurgical ? "Atraumatic Flap & Tooth Sectioning" : "Gentle Socket Expansion & Luxation",
          desc: isSurgical
            ? "Creating a tiny conservative flap and gently sectioning the impacted tooth into small segments for effortless, atraumatic removal."
            : "Gradually and smoothly expanding the periodontal ligament with micro-elevators to deliver the tooth intact with minimal pressure.",
        },
        {
          step: 3,
          title: "Debridement & Antiseptic Socket Toilet",
          desc: "Curetting infected granulation tissue from the socket, flushing with sterile saline, and checking clean bony margins.",
        },
        {
          step: 4,
          title: "Hemostasis, Suturing & Gauze Compression",
          desc: "Placing a collagen sponge, applying dissolvable sutures if surgical, and compressing with sterile sterile gauze pack.",
        },
      ],
      effectsAndSensations: {
        during: "Zero sharp pain. You will feel firm pressure and vibration, but no pain whatsoever.",
        immediateAfter: "Socket is numb for 2-3 hours. Mild swelling and tenderness peak around 48 hours post-op.",
        anesthesiaType: "Profound Local Anesthesia & Block",
      },
      postCare: [
        {
          phase: "First 24 Hours",
          title: "Blood Clot Protection (Crucial)",
          instructions: [
            "Bite firmly on gauze pack for 45 minutes without chewing or talking.",
            "Do NOT spit forcefully, do NOT drink through a straw, and do NOT smoke. Dislodging the blood clot causes painful Dry Socket.",
            "Apply ice packs to cheek in 15-minute on/off intervals to minimize swelling.",
          ],
        },
        {
          phase: "Days 2 to 7",
          title: "Gentle Healing",
          instructions: [
            "Rinse gently with warm saltwater 3 times daily after meals; do not swish vigorously.",
            "Stick to soft, lukewarm foods: mashed potatoes, yogurt, eggs, smoothies, and clear soups.",
            "Take prescribed pain medication and antibiotics as scheduled.",
          ],
        },
        {
          phase: "Follow-up",
          title: "Suture Check & Healing Confirmation",
          instructions: [
            "Dissolvable sutures dissolve naturally in 7-10 days. Non-dissolvable sutures are painlessly removed in a 2-minute visit.",
          ],
        },
      ],
      clinicalBenefits: [
        "Instantly eliminates chronic infection, pericoronitis, and severe dental pain.",
        "Prevents impacted wisdom teeth from damaging neighboring molar roots or causing cyst formation.",
        "Protects front teeth from crowding caused by anterior eruptive pressure.",
        "Prepares the oral cavity cleanly for future dental implant restorations.",
      ],
      galleryImages: [
        "/images/services/surgical_extraction.png",
        "/images/services/wisdom_tooth_extraction.png",
        "/images/services/simple_extraction.png",
      ],
      faqs: [
        {
          question: "How do I prevent 'Dry Socket'?",
          answer: "Never smoke, drink through a straw, or spit forcefully for at least 72 hours. These actions create negative pressure in the mouth that can dislodge the vital healing blood clot.",
        },
        {
          question: "Will surgical wisdom tooth extraction hurt?",
          answer: "No. The procedure is performed under deep local anesthesia so you feel zero pain. Post-op swelling is normal and well-controlled with prescribed anti-inflammatory medication.",
        },
        {
          question: "When can I resume normal eating and exercise?",
          answer: "Stick to soft cool foods for 48 hours. Avoid vigorous gym exercise for 3 days to keep blood pressure low and prevent socket bleeding.",
        },
      ],
    };
  }

  // ── 8. Default Fallback ──────────────────────────────────
  return {
    categoryName: "Restorative Dental Care",
    summaryBadge: "Certified Specialist Procedure",
    preCare: [
      {
        title: "Clinical Exam & Medical History",
        desc: "Visual inspection and digital intraoral photography to diagnose the condition and discuss treatment options.",
      },
      {
        title: "Pre-Treatment Dietary Advice",
        desc: "Eat normally before your appointment. Inform our team of any medication or medical allergies.",
      },
    ],
    expectations: [
      {
        step: 1,
        title: "Digital Clinical Examination & Diagnostics",
        desc: "Thorough assessment of the target tooth and surrounding tissue using high-resolution digital imaging.",
      },
      {
        step: 2,
        title: "Painless Localized Preparation",
        desc: "Gentle preparation of the tooth under computer-controlled local anesthesia ensuring maximum patient comfort.",
      },
      {
        step: 3,
        title: "Restorative Procedure",
        desc: "Execution of the restorative dental treatment adhering to European Class-B sterile standards.",
      },
      {
        step: 4,
        title: "Occlusal Bite Alignment & High-Gloss Polish",
        desc: "Fine-tuning bite articulation and polishing restorative surfaces for natural aesthetic finish.",
      },
    ],
    effectsAndSensations: {
      during: "Virtually painless with local numbing. Slight pressure or vibration is normal.",
      immediateAfter: "Numbness for 2-3 hours. Restoration feels smooth, comfortable, and natural.",
      anesthesiaType: "Computerized Local Anesthesia",
    },
    postCare: [
      {
        phase: "Immediate Post-Op",
        title: "Numbness Care",
        instructions: [
          "Wait for numbness to subside completely before chewing solid foods.",
          customInstructions || "Maintain gentle oral hygiene and avoid chewing hard objects directly on the treated tooth.",
        ],
      },
      {
        phase: "Long-Term",
        title: "Maintenance",
        instructions: [
          "Brush twice daily with fluoridated toothpaste and floss regularly.",
          "Visit Elite Dental Centre every 6 months for your routine dental examination.",
        ],
      },
    ],
    clinicalBenefits: [
      "Stops decay progression and restores structural tooth integrity.",
      "Blends naturally with your surrounding teeth in color, luster, and shape.",
      "Restores comfortable, painless chewing function.",
    ],
    galleryImages: [
      "/images/services/dental_crown.png",
      "/images/services/dental_filling.png",
      "/images/services/crown.png",
    ],
    faqs: [
      {
        question: "Is this procedure painful?",
        answer: "We prioritize patient comfort above all else. Modern gentle techniques and effective local anesthesia ensure virtually painless appointments.",
      },
      {
        question: "How long does this appointment take?",
        answer: "Most routine restorative procedures are completed in a single comfortable visit lasting 30 to 60 minutes.",
      },
      {
        question: "How can I maintain the best results after treatment?",
        answer: customInstructions || "Maintain consistent twice-daily brushing, daily flossing, and visit Elite Dental Centre every 6 months for a routine checkup.",
      },
    ],
  };
}
