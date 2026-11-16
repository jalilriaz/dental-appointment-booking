import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    // Returns a new PrismaClient instance
    return new PrismaClient();
};

declare global {
    var prismaGlobalFix3: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobalFix3 ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobalFix3 = prisma;
