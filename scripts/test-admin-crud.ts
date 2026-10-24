import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🧪 Starting Admin CRUD Tests...');

    // 1. Test Service Creation
    console.log('\n--- Testing Service Creation ---');
    const category = await prisma.serviceCategory.findFirst();
    if (!category) throw new Error('No service category found');

    const newService = await prisma.treatmentOption.create({
        data: {
            name: 'Test Setup Service',
            categoryId: category.id,
            originalPrice: 5000,
            durationMin: 30,
            isActive: true
        }
    });
    console.log('✅ Service created via Prisma:', newService.name);

    // 2. Test Staff Creation
    console.log('\n--- Testing Staff Creation ---');
    const staffEmail = `test.staff.${Date.now()}@elitedental.com`;
    const newStaff = await prisma.user.create({
        data: {
            name: 'Test Staff',
            email: staffEmail,
            password: 'hashed_password_placeholder', // API handles hashing, here we just test DB insert
            role: Role.STAFF,
            specialization: 'Tester',
            workingHours: JSON.stringify({ mon: { start: '09:00', end: '17:00' } })
        }
    });
    console.log('✅ Staff created via Prisma:', newStaff.email);

    // 3. Clean up
    console.log('\n--- Cleaning up ---');
    await prisma.treatmentOption.delete({ where: { id: newService.id } });
    await prisma.user.delete({ where: { id: newStaff.id } });
    console.log('✅ Cleanup complete');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
