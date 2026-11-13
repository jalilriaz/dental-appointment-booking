export interface TreatmentSeedItem {
  id: string;
  name: string;
  price: number;
  maxPrice?: number;
  durationMin: number;
  description: string;
  instructions?: string;
  imageUrl?: string | null;
  isMultiSession?: boolean;
  defaultSessions?: number;
}

export const ALL_TREATMENTS: TreatmentSeedItem[] = [
  {
    id: "treatment-1",
    name: "German Implant Kit",
    price: 80000,
    maxPrice: 95000,
    durationMin: 75,
    description:
      "Precision German titanium fixture offering exceptional biocompatibility and osseointegration, crowned with custom handcrafted porcelain for long-lasting bite stability and natural aesthetics.",
    instructions: "Avoid hard foods for 2 weeks. Follow-up in 7 days.",
    imageUrl: null,
    isMultiSession: true,
    defaultSessions: 3,
  },
  {
    id: "treatment-2",
    name: "American Implant Kit",
    price: 90000,
    maxPrice: 110000,
    durationMin: 75,
    description:
      "Advanced American surgical implant engineering featuring patented micro-textured titanium surface, guaranteed lifetime structural warranty, and painless 3D computer-guided sterile placement protocol.",
    instructions: "Avoid hard foods for 2 weeks. Follow-up in 7 days.",
    imageUrl: null,
    isMultiSession: true,
    defaultSessions: 3,
  },
  {
    id: "treatment-3",
    name: "Korean Implant Kit",
    price: 70000,
    maxPrice: 85000,
    durationMin: 75,
    description:
      "Cost-effective Korean titanium dental implant delivering outstanding clinical durability, rapid bone integration, and seamless aesthetic restoration for permanent missing tooth replacement.",
    instructions: "Avoid hard foods for 2 weeks. Follow-up in 7 days.",
    imageUrl: null,
    isMultiSession: true,
    defaultSessions: 3,
  },
  {
    id: "treatment-4",
    name: "American Whitening Kit",
    price: 22000,
    maxPrice: 28000,
    durationMin: 60,
    description:
      "Fast-acting American clinical whitening formula that safely dissolves deep enamel stains, brightening your smile up to six shades in one session.",
    instructions: "Avoid colored drinks (tea, coffee) for 48 hours.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-5",
    name: "German Whitening Kit",
    price: 27000,
    maxPrice: 34000,
    durationMin: 60,
    description:
      "Gentle and effective German whitening technology formulated with enamel-protecting minerals to prevent tooth sensitivity while delivering vibrant, long-lasting cosmetic smile radiance.",
    instructions: "Avoid colored drinks (tea, coffee) for 48 hours.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-6",
    name: "Laser Whitening",
    price: 37000,
    maxPrice: 45000,
    durationMin: 60,
    description:
      "State-of-the-art medical laser activation system accelerating specialized whitening gel, dramatically lifting stubborn discolouration up to eight shades in forty-five minutes.",
    instructions: "Avoid colored drinks for 48 hours. Sensitivity is normal for 24-48 hrs.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-7",
    name: "Basic Scaling",
    price: 2500,
    maxPrice: 4000,
    durationMin: 45,
    description:
      "Standard ultrasonic scaling and gentle prophylactic polishing that effectively removes hardened tartar, plaque deposits, and surface stains to maintain healthy gums.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-8",
    name: "Deep Scaling",
    price: 5000,
    maxPrice: 8000,
    durationMin: 60,
    description:
      "Thorough periodontal root planing and subgingival debridement designed to eliminate deep bacterial pockets, halt gum recession, and restore periodontal tissue health.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-9",
    name: "Full Mouth Scaling & Polishing",
    price: 7000,
    maxPrice: 10000,
    durationMin: 60,
    description:
      "Comprehensive full-mouth ultrasonic scaling combined with high-gloss prophy-jet air polishing and protective fluoride treatment for total freshness and superior oral hygiene.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-10",
    name: "Single Canal RCT",
    price: 13000,
    maxPrice: 16000,
    durationMin: 60,
    description:
      "Gentle single-sitting root canal treatment for anterior teeth using computerized rotary files, sterile irrigation, and bioceramic sealing to relieve tooth pain.",
    instructions: "Avoid chewing on treated side for 24 hours. Take prescribed painkillers.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-11",
    name: "Multi Canal RCT",
    price: 22000,
    maxPrice: 28000,
    durationMin: 75,
    description:
      "Microscopic endodontic therapy for complex multi-rooted molars, meticulously cleaning curved root canals, eliminating deep infection, and preserving your natural molar tooth.",
    instructions: "Avoid chewing on treated side for 24 hours. Take prescribed painkillers.",
    imageUrl: null,
    isMultiSession: true,
    defaultSessions: 2,
  },
  {
    id: "treatment-12",
    name: "Simple Extraction",
    price: 4000,
    maxPrice: 6000,
    durationMin: 45,
    description:
      "Gentle and atraumatic removal of damaged or unrestorable visible teeth performed under painless local anesthesia with rapid recovery socket preservation care.",
    instructions: "Bite on gauze for 30 min. Soft diet for 24 hours.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-13",
    name: "Surgical Extraction",
    price: 10000,
    maxPrice: 14000,
    durationMin: 60,
    description:
      "Precision surgical removal of broken or severely fractured roots below gum line, using delicate sectioning techniques, sterile irrigation, and dissolvable microsutures.",
    instructions: "Apply ice pack. Soft diet for 48 hours. Take prescribed medications.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-14",
    name: "Wisdom Tooth Extraction",
    price: 13000,
    maxPrice: 18000,
    durationMin: 75,
    description:
      "Specialized surgical extraction of impacted third molars, safely relieving jaw stiffness, swelling, and crowding through modern pain-free techniques and guided recovery.",
    instructions: "Apply ice pack. Soft diet for 48 hours. Take prescribed medications.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-15",
    name: "Metal Braces",
    price: 75000,
    maxPrice: 95000,
    durationMin: 60,
    description:
      "Time-tested high-grade stainless steel orthodontic brackets delivering precise arch realignment, bite correction, and lasting smile symmetry for patients of all ages.",
    imageUrl: null,
    isMultiSession: true,
    defaultSessions: 6,
  },
  {
    id: "treatment-16",
    name: "Ceramic Braces",
    price: 110000,
    maxPrice: 135000,
    durationMin: 60,
    description:
      "Aesthetic tooth-colored ceramic brackets that blend naturally with your teeth, providing powerful bite alignment with enhanced cosmetic discretion throughout orthodontic treatment.",
    imageUrl: null,
    isMultiSession: true,
    defaultSessions: 6,
  },
  {
    id: "treatment-17",
    name: "Invisible Aligners",
    price: 230000,
    maxPrice: 280000,
    durationMin: 45,
    description:
      "Custom 3D-scanned clear removable aligner trays that straighten teeth discreetly without metal wires, allowing effortless brushing and unrestricted daily dietary freedom.",
    imageUrl: null,
    isMultiSession: true,
    defaultSessions: 6,
  },
  {
    id: "treatment-18",
    name: "Composite Veneer (per tooth)",
    price: 7000,
    maxPrice: 10000,
    durationMin: 60,
    description:
      "Direct composite resin sculpting performed in a single visit, seamlessly correcting chipped enamel, minor gaps, and discoloration for an instant smile makeover.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-19",
    name: "Porcelain Veneer (per tooth)",
    price: 22000,
    maxPrice: 28000,
    durationMin: 60,
    description:
      "Handcrafted ultra-durable porcelain shells custom-bonded to anterior teeth for lifelike optical translucency, stain resistance, and a permanently radiant red-carpet smile.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-20",
    name: "Lumineers (per tooth)",
    price: 32000,
    maxPrice: 38000,
    durationMin: 60,
    description:
      "Ultra-thin contact-lens-like porcelain veneers placed with minimal to zero enamel shaving, preserving natural tooth structure while achieving remarkable cosmetic perfection.",
    imageUrl: null,
    isMultiSession: false,
  },
  {
    id: "treatment-21",
    name: "General Consultation & Dental Checkup",
    price: 2000,
    maxPrice: 2000,
    durationMin: 30,
    description:
      "Comprehensive oral examination, digital intraoral inspection, and personalized treatment plan with Dr. Sheriyaar. Consultation fee waived if procedure is initiated.",
    instructions: "Please arrive 10 minutes early. Bring any previous dental X-rays if available.",
    imageUrl: null,
    isMultiSession: false,
    defaultSessions: 1,
  },
];
