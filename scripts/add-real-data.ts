import { PrismaClient, Role, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { categories } from './data/services';
import { realUsers } from './data/users';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting Real Data Seeding...');

    // 1. Clinic Settings
    console.log('🏥 Updating Clinic Settings...');
    const settings = await prisma.clinicSettings.findFirst();
    if (settings) {
        await prisma.clinicSettings.update({
            where: { id: settings.id },
            data: {
                clinicName: 'Elite Dental Centre',
                address: 'Suite 12, Medical Plaza, Murree Road, Rawalpindi, Punjab, Pakistan',
                phone: '+92-300-1234567',
                email: 'info@elitedental.com',
                workingHoursStart: '12:00',
                workingHoursEnd: '20:00',
            }
        });
    } else {
        await prisma.clinicSettings.create({
            data: {
                clinicName: 'Elite Dental Centre',
                address: 'Suite 12, Medical Plaza, Murree Road, Rawalpindi, Punjab, Pakistan',
                phone: '+92-300-1234567',
                email: 'info@elitedental.com',
                workingHoursStart: '12:00',
                workingHoursEnd: '20:00',
            }
        });
    }

    // 2. Services & Treatments
    console.log('🦷 Upserting Services & Treatments...');
    for (const cat of categories) {
        let category = await prisma.serviceCategory.findUnique({
            where: { name: cat.name },
        });

        if (category) {
            console.log(`   . Category exists: ${cat.name}`);
        } else {
            category = await prisma.serviceCategory.create({
                data: {
                    name: cat.name,
                    description: cat.description,
                    icon: cat.icon,
                    displayOrder: cat.displayOrder,
                },
            });
            console.log(`   + Created Category: ${cat.name}`);
        }

        for (const t of cat.treatments) {
            // Find existing treatment by name within this category
            const existingTreatment = await prisma.treatmentOption.findFirst({
                where: {
                    name: t.name,
                    categoryId: category.id
                }
            });

            if (existingTreatment) {
                // Update prices and details
                await prisma.treatmentOption.update({
                    where: { id: existingTreatment.id },
                    data: {
                        originalPrice: t.original,
                        discountedPrice: t.discount,
                        durationMin: t.duration,
                        description: t.desc,
                        displayOrder: t.order,
                    }
                });
                console.log(`     ~ Updated Treatment: ${t.name}`);
            } else {
                await prisma.treatmentOption.create({
                    data: {
                        name: t.name,
                        originalPrice: t.original,
                        discountedPrice: t.discount,
                        durationMin: t.duration,
                        description: t.desc,
                        displayOrder: t.order,
                        categoryId: category.id,
                    }
                });
                console.log(`     + Added Treatment: ${t.name}`);
            }
        }
    }

    // 3. Real Users
    console.log('👥 Creating Real Users...');
    const defaultPassword = await bcrypt.hash('SecurePass123!', 10);

    for (const user of realUsers) {
        try {
            const existing = await prisma.user.findUnique({ where: { email: user.email } });
            if (!existing) {
                await prisma.user.create({
                    data: {
                        email: user.email,
                        password: defaultPassword,
                        name: user.name,
                        role: user.role,
                        phone: user.phone,

                        // Staff fields
                        specialization: user.specialization,
                        qualification: user.qualification,
                        experience: user.experience,
                        bio: user.bio,
                        workingHours: user.workingHours,

                        // Patient fields
                        gender: user.gender,
                        dateOfBirth: user.dob,
                        address: user.address,
                    }
                });
                console.log(`   + Created User: ${user.name} (${user.role})`);
            } else {
                console.log(`   . User exists: ${user.email}`);
            }
        } catch (e) {
            console.error(`   ❌ Failed to create ${user.email}:`, e);
        }
    }

    console.log('\n✅ Real Data Seeding Completed!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
