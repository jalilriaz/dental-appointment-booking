import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
    // Returns a new PrismaClient instance
    return new PrismaClient();
};

declare global {
    var prismaGlobalFix2: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobalFix2 ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobalFix2 = prisma;
