export const categories = [
    {
        name: 'Implants',
        description: 'High-quality dental implants for permanent smile restoration',
        icon: '🦷',
        displayOrder: 1,
        treatments: [
            { name: 'German Implant Kit', original: 120000, discount: 110000, duration: 120, desc: 'Premium German quality implant system.', order: 1 },
            { name: 'American Implant Kit', original: 135000, discount: 125000, duration: 120, desc: 'Advanced American implant technology.', order: 2 },
        ],
    },
    {
        name: 'Teeth Whitening',
        description: 'Professional whitening for a brighter smile',
        icon: '✨',
        displayOrder: 2,
        treatments: [
            { name: 'American Whitening Kit', original: 35000, discount: 30000, duration: 60, desc: 'Fast-acting American whitening formula.', order: 1 },
            { name: 'German Whitening Kit', original: 30000, discount: 27000, duration: 60, desc: 'Gentle and effective German whitening.', order: 2 },
        ],
    },
    {
        name: 'Scaling & Polishing',
        description: 'Professional cleaning for optimal oral hygiene',
        icon: '🪥',
        displayOrder: 3,
        treatments: [
            { name: 'Basic Scaling', original: 10000, discount: 8000, duration: 30, desc: 'Standard plaque and tartar removal.', order: 1 },
            { name: 'Deep Scaling', original: 20000, discount: 13000, duration: 45, desc: 'Thorough deep cleaning for advanced needs.', order: 2 },
        ],
    },
    {
        name: 'Root Canal Treatment',
        description: 'Specialized care to save and restore damaged teeth',
        icon: '🔧',
        displayOrder: 4,
        treatments: [
            { name: 'Single Canal RCT', original: 18000, discount: 15000, duration: 90, desc: 'Standard root canal therapy.', order: 1 },
            { name: 'Multi Canal RCT', original: 25000, discount: 22000, duration: 120, desc: 'Complex root canal for multi-rooted teeth.', order: 2 },
        ],
    },
    {
        name: 'Tooth Extraction',
        description: 'Safe and pain-free removal of problematic teeth',
        icon: '🏥',
        displayOrder: 5,
        treatments: [
            { name: 'Simple Extraction', original: 3500, discount: 3000, duration: 30, desc: 'Routine removal of a visible tooth.', order: 1 },
            { name: 'Surgical Extraction', original: 8000, discount: 6500, duration: 60, desc: 'Complex removal of impacted teeth.', order: 2 },
        ],
    },
    {
        name: 'Braces & Orthodontics',
        description: 'Straighten your teeth with modern orthodontic solutions',
        icon: '😁',
        displayOrder: 6,
        treatments: [
            { name: 'Metal Braces', original: 120000, discount: 110000, duration: 90, desc: 'Traditional metal braces.', order: 1 },
            { name: 'Ceramic Braces', original: 150000, discount: 140000, duration: 90, desc: 'Aesthetic clear ceramic braces.', order: 2 },
        ],
    },
    {
        name: 'Veneers',
        description: 'Custom shells for a flawless aesthetic improvement',
        icon: '💎',
        displayOrder: 7,
        treatments: [
            { name: 'Composite Veneer (per tooth)', original: 15000, discount: 12000, duration: 45, desc: 'Cost-effective aesthetic enhancement.', order: 1 },
            { name: 'Porcelain Veneer (per tooth)', original: 35000, discount: 30000, duration: 60, desc: 'High-durability porcelain veneer.', order: 2 },
        ],
    },
];
