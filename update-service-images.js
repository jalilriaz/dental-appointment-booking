const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Premium descriptions and image URLs for the ACTUAL 18 treatments in the database
const updates = [
  {
    name: 'Amalgam filling per tooth',
    imageUrl: '/images/services/filling.png',
    description: 'Trusted silver amalgam restoration renowned for its exceptional durability and strength. Ideal for posterior teeth that endure heavy chewing forces, providing a long-lasting, reliable solution for moderate to large cavities.',
  },
  {
    name: 'American Implant',
    imageUrl: '/images/services/american_implant.png',
    description: 'State-of-the-art American implant technology backed by extensive clinical research and a comprehensive lifetime warranty. Delivers exceptional stability with a tapered design that mimics natural tooth roots for a seamless, permanent restoration.',
  },
  {
    name: 'Braces',
    imageUrl: '/images/services/metal_braces.png',
    description: 'Precision orthodontic treatment engineered to transform your smile through controlled, gradual tooth movement. Modern low-profile brackets with heat-activated archwires deliver efficient alignment with enhanced comfort throughout your journey to a perfect smile.',
  },
  {
    name: 'Composite laser filling per tooth',
    imageUrl: '/images/services/laser_whitening.png',
    description: 'Advanced laser-cured composite restoration using cutting-edge blue-light polymerization technology. Delivers a flawless, tooth-colored result that blends invisibly with your natural enamel — the gold standard in modern aesthetic dentistry.',
  },
  {
    name: 'Deep Scaling & Polishing',
    imageUrl: '/images/services/deep_scaling.png',
    description: 'Comprehensive subgingival deep cleaning designed for patients with early-to-moderate periodontal concerns. Our specialists meticulously debride below the gumline using precision curettes and ultrasonic instruments, followed by a professional polish for a fresh, healthy finish.',
  },
  {
    name: 'German Implant',
    imageUrl: '/images/services/german_implant.png',
    description: 'Precision-engineered German titanium implant system renowned for unparalleled durability and biocompatibility. Features advanced surface technology for accelerated osseointegration and a premium ceramic crown for a flawless, natural finish.',
  },
  {
    name: 'Gic filling per tooth',
    imageUrl: '/images/services/single_canal_rct.png',
    description: 'Biocompatible glass ionomer cement restoration that chemically bonds to tooth structure while releasing cavity-fighting fluoride over time. An excellent choice for patients seeking a tooth-friendly, preventive filling material with therapeutic benefits.',
  },
  {
    name: 'PFM Crown per unit',
    imageUrl: '/images/services/crown.png',
    description: 'Premium porcelain-fused-to-metal crown combining the natural translucency of dental porcelain with the structural integrity of a precision-cast metal substructure. Expertly crafted for a durable, aesthetically pleasing full-coverage restoration.',
  },
  {
    name: 'Root Canal',
    imageUrl: '/images/services/single_canal_rct.png',
    description: 'Precision endodontic therapy performed under magnification for exceptional accuracy. Removes infected pulp tissue, thoroughly disinfects the intricate canal system, and seals with biocompatible filling material — preserving your natural tooth and eliminating pain at the source.',
  },
  {
    name: 'Scaling & Polishing',
    imageUrl: '/images/services/full_mouth_scaling.png',
    description: 'Essential preventive dental cleaning using advanced ultrasonic scaling technology to gently remove plaque, tartar, and surface stains, followed by a high-gloss polish with fine-grain prophylaxis paste. The cornerstone of optimal oral hygiene and a radiant smile.',
  },
  {
    name: 'Simple Tooth Extraction',
    imageUrl: '/images/services/simple_extraction.png',
    description: 'Gentle and efficient removal of a fully erupted tooth using controlled elevation and luxation techniques. Performed under local anesthesia with meticulous emphasis on preserving surrounding bone structure for future restorative options.',
  },
  {
    name: 'Surgical Tooth Extraction',
    imageUrl: '/images/services/surgical_extraction.png',
    description: 'Expert surgical removal of impacted, fractured, or below-gumline teeth requiring precision soft tissue management. Includes careful bone contouring and meticulous suturing performed by our oral surgery specialist for optimal healing and patient comfort.',
  },
  {
    name: 'Swiss Implant',
    imageUrl: '/images/services/korean_implant.png',
    description: 'Ultra-premium Swiss-manufactured implant system combining legendary precision engineering with cutting-edge bioactive surface technology. Crafted from the highest-grade titanium for superior osseointegration and a lifetime of confident, natural-looking smiles.',
  },
  {
    name: 'Teeth Whitening American Kit',
    imageUrl: '/images/services/american_whitening.png',
    description: 'FDA-approved American professional whitening system delivering visible results in a single session. Utilizes a high-concentration peroxide gel with built-in desensitizing agents to brighten your smile up to 6 shades with minimal sensitivity.',
  },
  {
    name: 'Teeth Whitening German Kit',
    imageUrl: '/images/services/german_whitening.png',
    description: 'Clinically tested German whitening technology featuring a gentle yet powerful enamel-safe formula. Precision-engineered applicators ensure uniform coverage for a brilliantly even, radiant smile without compromising tooth integrity.',
  },
  {
    name: 'Temporary Filling',
    imageUrl: '/images/services/simple_extraction.png',
    description: 'Protective interim restoration expertly placed to safeguard a prepared tooth between appointments. Seals the cavity against bacteria and sensitivity while maintaining tooth structure integrity until your permanent restoration is ready.',
  },
  {
    name: 'Zirconia Crown per unit',
    imageUrl: '/images/services/crown.png',
    description: 'State-of-the-art monolithic zirconia crown milled from a solid block of translucent zirconia for extraordinary strength and a beautifully natural appearance. Metal-free, biocompatible, and virtually indestructible — the pinnacle of modern dental crown technology.',
  },
  {
    name: 'Zirconia e max Crown per unit',
    imageUrl: '/images/services/veneers.png',
    description: 'The ultimate in aesthetic crown restoration — premium IPS e.max lithium disilicate layered over a zirconia framework for unmatched translucency, lifelike depth of color, and exceptional fracture resistance. Our most premium and natural-looking crown option.',
  },
];

async function main() {
  console.log('Updating treatment images and descriptions...');

  let updated = 0;
  let notFound = 0;

  for (const update of updates) {
    try {
      const treatment = await prisma.treatment.findFirst({
        where: { name: update.name },
      });

      if (!treatment) {
        console.log('  Not found: ' + update.name);
        notFound++;
        continue;
      }

      await prisma.treatment.update({
        where: { id: treatment.id },
        data: {
          imageUrl: update.imageUrl,
          description: update.description,
        },
      });

      console.log('  Updated: ' + update.name);
      updated++;
    } catch (err) {
      console.error('  Failed: ' + update.name + ' - ' + err.message);
    }
  }

  console.log('\nDone! Updated: ' + updated + ', Not found: ' + notFound);
}

main()
  .catch((e) => { console.error('Script failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
