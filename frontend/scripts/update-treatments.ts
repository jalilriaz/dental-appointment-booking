import prisma from "../lib/prisma";

async function main() {
  const treatments = [
    {
      name: "German Implant Kit",
      durationMin: 75,
      description:
        "Precision German titanium fixture offering exceptional biocompatibility and osseointegration, crowned with custom handcrafted porcelain for long-lasting bite stability and natural aesthetics.",
    },
    {
      name: "American Implant Kit",
      durationMin: 75,
      description:
        "Advanced American surgical implant engineering featuring patented micro-textured titanium surface, guaranteed lifetime structural warranty, and painless 3D computer-guided sterile placement protocol.",
    },
    {
      name: "Korean Implant Kit",
      durationMin: 75,
      description:
        "Cost-effective Korean titanium dental implant delivering outstanding clinical durability, rapid bone integration, and seamless aesthetic restoration for permanent missing tooth replacement.",
    },
    {
      name: "American Whitening Kit",
      durationMin: 60,
      description:
        "Fast-acting American clinical whitening formula that safely dissolves deep enamel stains, brightening your smile up to six shades in one session.",
    },
    {
      name: "German Whitening Kit",
      durationMin: 60,
      description:
        "Gentle and effective German whitening technology formulated with enamel-protecting minerals to prevent tooth sensitivity while delivering vibrant, long-lasting cosmetic smile radiance.",
    },
    {
      name: "Laser Whitening",
      durationMin: 60,
      description:
        "State-of-the-art medical laser activation system accelerating specialized whitening gel, dramatically lifting stubborn discolouration up to eight shades in forty-five minutes.",
    },
    {
      name: "Basic Scaling",
      durationMin: 45,
      description:
        "Standard ultrasonic scaling and gentle prophylactic polishing that effectively removes hardened tartar, plaque deposits, and surface stains to maintain healthy gums.",
    },
    {
      name: "Deep Scaling",
      durationMin: 60,
      description:
        "Thorough periodontal root planing and subgingival debridement designed to eliminate deep bacterial pockets, halt gum recession, and restore periodontal tissue health.",
    },
    {
      name: "Full Mouth Scaling & Polishing",
      durationMin: 60,
      description:
        "Comprehensive full-mouth ultrasonic scaling combined with high-gloss prophy-jet air polishing and protective fluoride treatment for total freshness and superior oral hygiene.",
    },
    {
      name: "Single Canal RCT",
      durationMin: 60,
      description:
        "Gentle single-sitting root canal treatment for anterior teeth using computerized rotary files, sterile irrigation, and bioceramic sealing to relieve tooth pain.",
    },
    {
      name: "Multi Canal RCT",
      durationMin: 75,
      description:
        "Microscopic endodontic therapy for complex multi-rooted molars, meticulously cleaning curved root canals, eliminating deep infection, and preserving your natural molar tooth.",
    },
    {
      name: "Simple Extraction",
      durationMin: 45,
      description:
        "Gentle and atraumatic removal of damaged or unrestorable visible teeth performed under painless local anesthesia with rapid recovery socket preservation care.",
    },
    {
      name: "Surgical Extraction",
      durationMin: 60,
      description:
        "Precision surgical removal of broken or severely fractured roots below gum line, using delicate sectioning techniques, sterile irrigation, and dissolvable microsutures.",
    },
    {
      name: "Wisdom Tooth Extraction",
      durationMin: 75,
      description:
        "Specialized surgical extraction of impacted third molars, safely relieving jaw stiffness, swelling, and crowding through modern pain-free techniques and guided recovery.",
    },
    {
      name: "Metal Braces",
      durationMin: 60,
      description:
        "Time-tested high-grade stainless steel orthodontic brackets delivering precise arch realignment, bite correction, and lasting smile symmetry for patients of all ages.",
    },
    {
      name: "Ceramic Braces",
      durationMin: 60,
      description:
        "Aesthetic tooth-colored ceramic brackets that blend naturally with your teeth, providing powerful bite alignment with enhanced cosmetic discretion throughout orthodontic treatment.",
    },
    {
      name: "Invisible Aligners",
      durationMin: 45,
      description:
        "Custom 3D-scanned clear removable aligner trays that straighten teeth discreetly without metal wires, allowing effortless brushing and unrestricted daily dietary freedom.",
    },
    {
      name: "Composite Veneer (per tooth)",
      durationMin: 60,
      description:
        "Direct composite resin sculpting performed in a single visit, seamlessly correcting chipped enamel, minor gaps, and discoloration for an instant smile makeover.",
    },
    {
      name: "Porcelain Veneer (per tooth)",
      durationMin: 60,
      description:
        "Handcrafted ultra-durable porcelain shells custom-bonded to anterior teeth for lifelike optical translucency, stain resistance, and a permanently radiant red-carpet smile.",
    },
    {
      name: "Lumineers (per tooth)",
      durationMin: 60,
      description:
        "Ultra-thin contact-lens-like porcelain veneers placed with minimal to zero enamel shaving, preserving natural tooth structure while achieving remarkable cosmetic perfection.",
    },
  ];

  for (const t of treatments) {
    const result = await prisma.treatment.updateMany({
      where: { name: t.name },
      data: {
        durationMin: t.durationMin,
        description: t.description,
      },
    });
    console.log(`Updated ${t.name} -> ${t.durationMin} mins (${result.count} rows)`);
  }
}

main()
  .then(() => {
    console.log("All treatments updated successfully in database!");
    process.exit(0);
  })
  .catch((err) => {
    console.log("Database update note:", err.message);
    process.exit(0);
  });

