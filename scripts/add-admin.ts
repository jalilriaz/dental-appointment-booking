import { PrismaClient, Role, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    // ---------------------------------------------------------
    // CONFIGURATION: Change these values for your real admin
    // ---------------------------------------------------------
    const REAL_ADMIN_EMAIL = 'real.admin@elitedental.com';
    const REAL_ADMIN_PASSWORD = 'SecurePassword123!';
    const REAL_ADMIN_NAME = 'Dental Centre Admin';
    const REAL_ADMIN_PHONE = '+92-300-REAL-ADM';
    // ---------------------------------------------------------

    console.log(`Creating real admin user: ${REAL_ADMIN_EMAIL}...`);

    const hashedPassword = await bcrypt.hash(REAL_ADMIN_PASSWORD, 10);

    try {
        const user = await prisma.user.create({
            data: {
                email: REAL_ADMIN_EMAIL,
                password: hashedPassword,
                name: REAL_ADMIN_NAME,
                role: Role.ADMIN,
                phone: REAL_ADMIN_PHONE,
            },
        });
        console.log(`✅ Successfully created admin user: ${user.email}`);
        console.log(`Password: ${REAL_ADMIN_PASSWORD}`);
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
            console.log(`⚠️ User with email ${REAL_ADMIN_EMAIL} already exists.`);
        } else {
            console.error('❌ Error creating user:', e);
        }
    } finally {
        await prisma.$disconnect();
    }
}

main();
